import { Body, Controller, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ReqResService } from './reqres.service';
import { UserDto } from './user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly reqResService: ReqResService) {}

  @Post()
  createUser(@Body() user: UserDto): Observable<string> {
    return this.reqResService
      .createUser(user)
      .pipe(map(() => JSON.stringify({ status: 'created' })));
  }
}
