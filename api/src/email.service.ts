import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

  constructor(private readonly configService: ConfigService) {}

  private get uri(): string | undefined {
    return this.configService.get<string>('smtp.uri');
  }

  private getTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        url: this.uri,
      });
    }
    return this.transporter;
  }

  async send(to: string, subject: string, text: string): Promise<string> {
    const transporter = this.getTransporter();
    const info = await transporter.sendMail({
      from: 'Mail service <mail-service@example.com>',
      to,
      subject,
      text,
    });
    return info.messageId;
  }
}
