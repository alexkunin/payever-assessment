import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { Connection } from 'mongoose';
import { join } from 'path';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable()
export class AvatarService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectConnection() private mongo: Connection,
  ) {}

  private get timeout(): number | undefined {
    return this.configService.get<number>('avatar.timeout');
  }

  private get path(): string {
    const result = this.configService.get<string>('avatar.path');
    if (result === undefined) {
      throw new Error('Avatar path is not configured');
    }
    return result;
  }

  private generateFilename(userId: number): string {
    return join(this.path, `${userId}.jpg`);
  }

  getAvatar(userId: number, url: string): Observable<Buffer> {
    return from(this.getFromMongo(userId)).pipe(
      switchMap((buffer) => {
        if (buffer !== null) {
          return of(buffer);
        }
        return this.httpService
          .get(url, {
            timeout: this.timeout,
          })
          .pipe(
            map((response) => Buffer.from(response.data, 'binary')),
            tap((buffer) => this.writeToFileStorage(userId, buffer)),
            tap((buffer) => this.saveToMongo(userId, buffer)),
          );
      }),
    );
  }

  async deleteAvatar(userId: number): Promise<void> {
    this.deleteFromFileStorage(userId);
    await this.deleteFromMongo(userId);
  }

  private writeToFileStorage(userId: number, buffer: Buffer): void {
    const filename = this.generateFilename(userId);
    if (!existsSync(filename)) {
      writeFileSync(filename, buffer);
    }
  }

  private deleteFromFileStorage(userId: number): void {
    const filename = this.generateFilename(userId);
    if (existsSync(filename)) {
      unlinkSync(filename);
    }
  }

  private async getFromMongo(userId: number): Promise<Buffer | null> {
    const result = await this.mongo.collection('avatars').findOne({ userId });
    if (result === null) {
      return null;
    }
    return Buffer.from(result.avatar, 'base64');
  }

  private async saveToMongo(userId: number, buffer: Buffer): Promise<void> {
    await this.mongo.collection('avatars').insertOne({
      userId,
      avatar: buffer.toString('base64'),
      hash: createHash('sha256').update(buffer).digest('hex'),
    });
  }

  private async deleteFromMongo(userId: number): Promise<void> {
    await this.mongo.collection('avatars').deleteOne({ userId });
  }
}
