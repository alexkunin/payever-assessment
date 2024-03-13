import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvatarService } from './avatar.service';
import configuration from './config/configuration';
import { DummyQueueEchoService } from './dummyqueueecho.service';
import { EmailService } from './email.service';
import { EmailNotificationsService } from './emailnotifications.service';
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const user = configService.get('mongo.user');
        const pass = configService.get('mongo.pass');
        const host = configService.get('mongo.host');
        const uri = `mongodb://${user}:${pass}@${host}/`;
        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, UsersController, UserController],
  providers: [
    AppService,
    ReqResService,
    AvatarService,
    QueueNotificationsService,
    EmailNotificationsService,
    RabbitMQService,
    DummyQueueEchoService,
    EmailService,
  ],
})
export class AppModule {}
