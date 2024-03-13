import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class DummyQueueEchoService {
  constructor(private readonly rabbitMQService: RabbitMQService) {
    this.rabbitMQService.subscribe('user', (msg) => {
      console.log('Received message:', msg);
    });
  }
}
