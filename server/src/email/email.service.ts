import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
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

  async sendVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"매일 Book Zip" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject: '[매일 Book Zip] 이메일 인증 코드',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">매일 Book Zip 이메일 인증</h2>
            <p>안녕하세요, 매일 Book Zip 서비스 이용을 위한 인증 코드입니다.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <h3 style="margin: 0; font-size: 24px;">${verificationCode}</h3>
            </div>
            <p>위 코드를 인증 화면에 입력하여 이메일 인증을 완료해주세요.</p>
            <p>이 코드는 10분 동안 유효합니다.</p>
            <p>본인이 요청하지 않은 경우 이 메일을 무시해주세요.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      return false;
    }
  }
}
