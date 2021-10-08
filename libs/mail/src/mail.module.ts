import { DynamicModule, Logger, Module } from '@nestjs/common';
import { MAIL_FROM, MAIL_TRANSPORT } from '@pr083/mail/symbols';
import * as mail from 'nodemailer';
import { MailService } from './mail.service';

@Module({})
export class MailModule {
  static forRoot(from: string, transport: mail.Transporter): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: MAIL_TRANSPORT,
          useValue: transport,
        },
        { provide: MAIL_FROM, useValue: from },
        MailService,
      ],
      exports: [MailService],
    };
  }

  static withTestAccount(from: string): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: MAIL_TRANSPORT,
          useFactory: async () => {
            const logger = new Logger(
              MailModule.name + ':' + 'testAccountFactory',
            );
            const account = await mail.createTestAccount();
            logger.log('Email web link: ' + account.web);
            return mail.createTransport({
              ...account.smtp,
              auth: account,
            });
          },
        },
        { provide: MAIL_FROM, useValue: from },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
