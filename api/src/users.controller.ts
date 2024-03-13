import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from './user.dto';

@Controller('/api/users')
export class UsersController {
  constructor() {}

  @Post()
  createUser(@Body() user: UserDto): string {
    return JSON.stringify({ user });
  }
}
