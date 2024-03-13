import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email.service';
import { UserCreatedEvent } from './events/usercreated.event';

@Injectable()
export class EmailNotificationsService {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(UserCreatedEvent.EVENT)
  async userCreated(event: UserCreatedEvent): Promise<void> {
    const messageId = await this.emailService.send(
      'notofications@example.com',
      'User created',
      'User ID: ' + event.id + ' created',
    );
    console.log('Message sent: %s', messageId);
  }
}
