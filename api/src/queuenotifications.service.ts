import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/usercreated.event';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class QueueNotificationsService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @OnEvent(UserCreatedEvent.EVENT)
  async userCreated(event: UserCreatedEvent): Promise<void> {
    await this.rabbitMQService.send(
      'user',
      JSON.stringify({ event: 'created', id: event.id }),
    );
  }
}
