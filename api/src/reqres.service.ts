import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { UserDto } from './user.dto';

@Injectable()
export class ReqResService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private get baseUrl(): string | undefined {
    return this.configService.get<string>('reqres.url');
  }

  private get timeout(): number | undefined {
    return this.configService.get<number>('reqres.timeout');
  }

  getUser(id: number): Observable<UserDto> {
    return this.httpService
      .get<{
        data: UserDto;
      }>(`${this.baseUrl}/users/${id}`, { timeout: this.timeout })
      .pipe(map((data) => data.data.data));
  }

  createUser(user: UserDto): Observable<void> {
    return this.httpService
      .post<UserDto>(`${this.baseUrl}/users`, user, { timeout: this.timeout })
      .pipe(map(() => void 0));
  }
}
