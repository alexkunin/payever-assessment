import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvatarService } from './avatar.service';
import configuration from './config/configuration';
import { DummyQueueEchoService } from './dummyqueueecho.service';
import { QueueNotificationsService } from './queuenotifications.service';
import { RabbitMQService } from './rabbitmq.service';
import { ReqResService } from './reqres.service';
import { UserController } from './user.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, UsersController, UserController],
  providers: [
    AppService,
    ReqResService,
    AvatarService,
    QueueNotificationsService,
    RabbitMQService,
    DummyQueueEchoService,
  ],
})
export class AppModule {}
