import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

@Injectable()
export class AvatarService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private get timeout(): number | undefined {
    return this.configService.get<number>('avatar.timeout');
  }

  getAvatar(url: string): Observable<Buffer> {
    return this.httpService
      .get(url, {
        timeout: this.timeout,
      })
      .pipe(map((response) => Buffer.from(response.data, 'binary')));
  }
}
