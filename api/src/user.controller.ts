import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, map, Observable, switchMap } from 'rxjs';
import { AvatarService } from './avatar.service';
import { ReqResService } from './reqres.service';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly reqResService: ReqResService,
    private readonly avatarService: AvatarService,
  ) {}

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): Observable<string> {
    return this.reqResService.getUser(id).pipe(
      map((response) => JSON.stringify(response)),
      catchError((error) => {
        if (error instanceof AxiosError && error.response?.status === 404) {
          throw new NotFoundException();
        }
        throw new InternalServerErrorException();
      }),
    );
  }

  @Get(':id/avatar')
  getAvatar(@Param('id', ParseIntPipe) id: number): Observable<string> {
    const url$ = this.reqResService
      .getUser(id)
      .pipe(map((response) => response.avatar));

    return url$.pipe(
      switchMap((url) => this.avatarService.getAvatar(url)),
      catchError((error) => {
        if (error instanceof AxiosError && error.response?.status === 404) {
          throw new NotFoundException();
        }
        throw new InternalServerErrorException();
      }),
      map((buffer) => buffer.toString('base64')),
    );
  }

  @Delete(':id/avatar')
  deleteAvatar(@Param('id', ParseIntPipe) id: number): string {
    return JSON.stringify({ id, type: 'avatar', action: 'delete' });
  }
}
