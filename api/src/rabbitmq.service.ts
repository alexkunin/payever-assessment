import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, connect, Connection } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor(private readonly configService: ConfigService) {
  }

  private get host(): string | undefined {
    return this.configService.get<string>('rabbitmq.host');
  }

  private get user(): string | undefined {
    return this.configService.get<string>('rabbitmq.user');
  }

  private get password(): string | undefined {
    return this.configService.get<string>('rabbitmq.password');
  }

  private get url(): string {
    return `amqp://${ this.user }:${ this.password }@${ this.host }:5672`;
  }

  private async getConnection(): Promise<Connection> {
    if (this.connection === null) {
      console.log(this.url);
      this.connection = await connect(this.url);
    }
    return this.connection;
  }

  private async getChannel(): Promise<Channel> {
    if (this.channel === null) {
      const connection = await this.getConnection();
      this.channel = await connection.createChannel();
    }
    return this.channel;
  }

  async send(queue: string, message: string): Promise<void> {
    const channel = await this.getChannel();

    await channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(message));
  }

  async subscribe(queue: string, callback: (message: string) => void): Promise<void> {
    const channel = await this.getChannel();

    await channel.assertQueue(queue, {
      durable: false,
    });

    await channel.consume(queue, (message) => {
      if (message !== null) {
        callback(message.content.toString());
        channel.ack(message);
      }
    });
  }

  onApplicationShutdown(signal: string) {
    if (this.channel !== null) {
      this.channel.close();
    }
  }
}
