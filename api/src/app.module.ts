import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController, UserController],
  providers: [AppService],
})
export class AppModule {}
