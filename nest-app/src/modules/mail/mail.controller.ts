import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '@common/decorators/auth.decorator';
import { ACCESS } from '@configs/role.config';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-mailer')
  @ApiOperation({
    summary: 'Send a test email to a specified address',
    deprecated: true,
  })
  @HttpCode(HttpStatus.OK)
  @Auth(ACCESS.SEND_MAIL_TEST)
  async sendMailer() {
    const res = await this.mailService.sendMailer({
      to: 'nguyenducnhanh2003@gmail.com',
      subject: 'Forgot password: User Password Recovery',
      template: 'forgot-password',
      context: {
        name: 'Nguyen Van A',
        otp: '123456',
      },
    });

    return { message: 'general.success', data: res };
  }
}
