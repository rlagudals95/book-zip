import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`이메일 전송 성공: ${info.messageId}`);

      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`이메일 전송 실패: ${err.message}`, err.stack);
      return false;
    }
  }

  async sendBookSummary(
    to: string,
    userName: string,
    bookTitle: string,
    summary: string,
  ) {
    const subject = `[매일북집] ${bookTitle} 요약`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a6ee0;">${userName}님을 위한 오늘의 책 요약</h2>
        <h3 style="color: #333;">${bookTitle}</h3>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px; line-height: 1.6;">
          ${summary.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-top: 20px; color: #666;">
          매일북집에서 제공하는 책 요약 서비스입니다. 
          <br>
          수신을 원치 않으시면 <a href="#" style="color: #4a6ee0;">프로필 설정</a>에서 이메일 수신을 해제할 수 있습니다.
        </p>
      </div>
    `;

    return this.sendMail(to, subject, html);
  }
}
