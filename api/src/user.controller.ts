import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('/api/user')
export class UserController {
  constructor() {}

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): string {
    return JSON.stringify({ id });
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
