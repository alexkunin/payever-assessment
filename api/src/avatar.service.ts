import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class AvatarService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
  }

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
    return join(this.path, `${ userId }.jpg`);
  }

  getAvatar(userId: number, url: string): Observable<Buffer> {
    return this.httpService
      .get(url, {
        timeout: this.timeout,
      })
      .pipe(
        map((response) => Buffer.from(response.data, 'binary')),
        tap((buffer) => this.writeToFileStorage(userId, buffer)),
      );
  }

  deleteAvatar(userId: number): void {
    const filename = this.generateFilename(userId);
    if (existsSync(filename)) {
      unlinkSync(filename);
    }
  }

  private writeToFileStorage(userId: number, buffer: Buffer): void {
    const filename = this.generateFilename(userId);
    if (!existsSync(filename)) {
      writeFileSync(filename, buffer);
    }
  }
}
