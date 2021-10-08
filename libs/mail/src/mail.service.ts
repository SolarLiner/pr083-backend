import {
  MAIL_FROM,
  MAIL_TRANSPORT,
  MailTransporter,
} from '@pr083/mail/symbols';
import { Inject, Injectable, Logger } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as mail from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    @Inject(MAIL_TRANSPORT) private readonly transporter: MailTransporter,
    @Inject(MAIL_FROM) private readonly from: string,
  ) {}

  async sendEmail(message: Omit<Mail.Options, 'from' | 'messageId'>) {
    const info = await this.transporter.sendMail({
      ...message,
      from: this.from,
    });
    this.logger.debug(`Message ${info.messageId} sent to ${info.envelope.to}`);
    const testMessageUrl = mail.getTestMessageUrl(info);
    if (testMessageUrl)
      this.logger.debug(`Message preview URL: ${testMessageUrl}`);
  }
}
