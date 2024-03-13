import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvatarService } from './avatar.service';
import configuration from './config/configuration';
import { ReqResService } from './reqres.service';
import { UserController } from './user.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController, UsersController, UserController],
  providers: [AppService, ReqResService, AvatarService],
})
export class AppModule {}
