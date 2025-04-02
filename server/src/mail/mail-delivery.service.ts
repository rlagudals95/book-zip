import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Subscriber,
  SubscriberDocument,
} from '../subscriber/schemas/subscriber.schema';
import {
  BookSummary,
  BookSummaryDocument,
} from '../books/schemas/book-summary.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class MailDeliveryService {
  private readonly logger = new Logger(MailDeliveryService.name);

  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: Model<SubscriberDocument>,
    @InjectModel(BookSummary.name)
    private bookSummaryModel: Model<BookSummaryDocument>,
    private emailService: EmailService,
  ) {}

  /**
   * 특정 구독자에게 특정 책 요약을 보낼 수 있는지 확인
   */
  async canSendBookToSubscriber(
    subscriberId: string,
    bookId: string,
  ): Promise<boolean> {
    const subscriber = await this.subscriberModel.findById(subscriberId);
    if (!subscriber || !subscriber.isActive) return false;

    // 이미 보낸 책인지 확인
    const alreadySent = subscriber.sentBooks.some(
      (book) => book.bookId === bookId,
    );
    return !alreadySent;
  }

  /**
   * 구독자에게 책 요약 전송 후 기록 업데이트
   */
  async sendBookToSubscriber(
    subscriberId: string,
    bookId: string,
  ): Promise<boolean> {
    // 중복 전송 확인
    const canSend = await this.canSendBookToSubscriber(subscriberId, bookId);
    if (!canSend) {
      this.logger.log(`이미 발송된 책: ${bookId}, 구독자: ${subscriberId}`);
      return false;
    }

    // 구독자와 책 정보 가져오기
    const subscriber = await this.subscriberModel.findById(subscriberId);
    const book = await this.bookSummaryModel.findById(bookId);

    if (!subscriber || !book) {
      this.logger.error(`구독자 또는 책 정보 없음: ${subscriberId}, ${bookId}`);
      return false;
    }

    // 이메일 발송
    const sent = await this.emailService.sendBookSummary(
      subscriber.email,
      subscriber.email.split('@')[0], // 간단한 사용자명 추출
      book.title,
      book.content,
    );

    if (sent) {
      // 구독자의 발송 기록 업데이트
      await this.subscriberModel.updateOne(
        { _id: subscriberId },
        {
          $push: {
            sentBooks: {
              bookId: bookId,
              sentAt: new Date(),
            },
          },
        },
      );

      // 책의 발송 통계 업데이트
      await this.bookSummaryModel.updateOne(
        { _id: bookId },
        {
          $inc: { sentCount: 1 },
          lastSentAt: new Date(),
          ...(book.sentCount === 0 ? { isSent: true } : {}),
        },
      );
    }

    return sent;
  }

  /**
   * 모든 구독자에게 오늘의 책 요약 발송
   */
  async sendDailyBookSummary(
    bookId: string,
  ): Promise<{ success: number; failed: number }> {
    const book = await this.bookSummaryModel.findById(bookId);
    if (!book) {
      throw new Error(`책 정보 없음: ${bookId}`);
    }

    // 활성 구독자 목록 가져오기
    const subscribers = await this.subscriberModel.find({ isActive: true });

    let success = 0;
    let failed = 0;

    // 각 구독자에게 발송 (관심사 필터링 포함)
    for (const subscriber of subscribers) {
      // 관심사 필터링 (구독자가 관심사를 선택했고, 책의 카테고리와 일치하는 게 없으면 건너뜀)
      if (
        subscriber.interests.length > 0 &&
        !book.categories.some((category) =>
          subscriber.interests.includes(category),
        )
      ) {
        continue;
      }

      // 중복 발송 확인
      const alreadySent = subscriber.sentBooks.some(
        (sent) => sent.bookId === bookId,
      );
      if (alreadySent) continue;

      const id = subscriber._id as string;

      // 이메일 발송
      const sent = await this.sendBookToSubscriber(id, bookId);
      if (sent) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }
}
