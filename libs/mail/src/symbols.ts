import * as mail from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type MailTransporter = mail.Transporter<SMTPTransport.SentMessageInfo>;
export const MAIL_TRANSPORT = Symbol('mail:transport');
export const MAIL_FROM = Symbol('mail:from');
