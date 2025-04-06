import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { BookDocument } from '../book/schemas/book.schema';
import { SubscriberDocument } from '../subscriber/schemas/subscriber.schema';
import { Model } from 'mongoose';
import { CronExpression } from '@nestjs/schedule';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from '../book/schemas/book.schema';
import { Subscriber } from '../subscriber/schemas/subscriber.schema';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<SubscriberDocument>,
  ) {
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

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendSummaryEmail(): Promise<void> {
    try {
      // 요약된 책 중 발송되지 않은 책 찾기
      const book = await this.bookModel
        .findOne({
          isSummarized: true,
          isSent: false,
        })
        .sort({ summarizedAt: 1 })
        .exec();

      if (!book) {
        this.logger.log('발송할 요약 책이 없습니다.');
        return;
      }

      // 활성화된 모든 구독자 가져오기
      const subscribers = await this.subscriberModel
        .find({
          isActive: true,
        })
        .exec();

      if (subscribers.length === 0) {
        this.logger.log('활성화된 구독자가 없습니다.');
        return;
      }

      // 발송 URL 생성
      const baseUrl =
        this.configService.get<string>('CLIENT_URL') || 'http://localhost:3000';

      const bookId = book._id as string;

      const bookDetailUrl = `${baseUrl}/book/${bookId}`;

      this.logger.log(
        `"${book.title}" 책 요약을 ${subscribers.length}명의 구독자에게 전송합니다.`,
      );

      // 모든 구독자에게 이메일 전송
      let successCount = 0;
      for (const subscriber of subscribers) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 30px 0;">
              <h1 style="color: #4a6ee0; margin: 0;">매일 북집</h1>
              <p style="color: #666; margin: 5px 0 0;">하루 5분, 책 한 권의 인사이트</p>
            </div>
            
            <div style="background-color: #f9f9f9; border-radius: 10px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">${subscriber.email || '독자'}님을 위한 오늘의 책</h2>
              
              <div style="display: flex; margin: 20px 0;">
                ${
                  book.coverImage
                    ? `<img src="${book.coverImage}" alt="${book.title} 표지" style="width: 120px; height: auto; object-fit: cover; border-radius: 5px; margin-right: 20px;">`
                    : '<div style="width: 120px; height: 180px; background-color: #eee; border-radius: 5px; margin-right: 20px; display: flex; justify-content: center; align-items: center;"><span style="color: #999;">No Image</span></div>'
                }
                
                <div>
                  <h3 style="color: #4a6ee0; margin-top: 0; margin-bottom: 5px;">${book.title}</h3>
                  <p style="color: #666; margin: 0 0 5px;"><strong>저자:</strong> ${book.author}</p>
                  <p style="color: #666; margin: 0 0 5px;"><strong>출판사:</strong> ${book.publisher || '정보 없음'}</p>
                  ${book.publishedYear ? `<p style="color: #666; margin: 0 0 5px;"><strong>출간년도:</strong> ${book.publishedYear}년</p>` : ''}
                  <p style="color: #666; margin: 0 0 5px;"><strong>읽는 시간:</strong> ${book.readingTime || '약 10분'}</p>
                </div>
              </div>
              
              <div style="margin: 20px 0;">
                <h4 style="color: #4a6ee0; margin-bottom: 10px;">핵심 요약</h4>
                <p style="color: #333; line-height: 1.6;">
                  ${book.summary ? book.summary.substring(0, 200) + '...' : '이 책의 전체 요약을 보려면 아래 버튼을 클릭하세요.'}
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${bookDetailUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">전체 요약 읽기</a>
              </div>
            </div>
            
            <div style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
              <p>매일북집에서 제공하는 책 요약 서비스입니다.</p>
            </div>
          </div>
        `;

        const subject = `[매일북집] ${book.title} - ${book.author} 책 요약`;
        const success = await this.sendMail(
          subscriber.email,
          subject,
          emailHtml,
        );

        if (success) {
          successCount++;
        }
      }

      await this.bookModel
        .findByIdAndUpdate(book._id, {
          isSent: true,
          sendAt: new Date(),
        })
        .exec();

      this.logger.log(
        `"${book.title}" 요약을 ${successCount}/${subscribers.length} 구독자에게 성공적으로 전송했습니다.`,
      );
    } catch (error) {
      this.logger.error(`요약 이메일 전송 실패: ${error.message}`, error.stack);
    }
  }
}
