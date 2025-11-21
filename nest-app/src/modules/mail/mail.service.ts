import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   *
   * Sends an email with the provided options
   * @method sendMailer
   * @param {ISendMailOptions} body - Email options including recipient, subject, content, etc.
   * @returns Response from the mailer service
   */
  async sendMailer(body: ISendMailOptions) {
    const res = await this.mailerService.sendMail(body);
    Logger.debug('🚀 ~ MailService ~ res:', res);
    return res;
  }
}
