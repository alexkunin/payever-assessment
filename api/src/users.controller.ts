import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { map, Observable, tap } from 'rxjs';
import { UserCreatedEvent } from './events/usercreated.event';
import { ReqResService } from './reqres.service';
import { UserDto } from './user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly reqResService: ReqResService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  createUser(@Body() user: UserDto): Observable<string> {
    return this.reqResService.createUser(user).pipe(
      tap(() => {
        this.eventEmitter.emit(
          UserCreatedEvent.EVENT,
          new UserCreatedEvent(user.id),
        );
      }),
      map(() => JSON.stringify({ status: 'created' })),
    );
  }
}
