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
import { catchError, map, Observable } from 'rxjs';
import { ReqResService } from './reqres.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly reqResService: ReqResService) {}

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
  getAvatar(@Param('id', ParseIntPipe) id: number): string {
    return JSON.stringify({ id, type: 'avatar' });
  }

  @Delete(':id/avatar')
  deleteAvatar(@Param('id', ParseIntPipe) id: number): string {
    return JSON.stringify({ id, type: 'avatar', action: 'delete' });
  }
}
