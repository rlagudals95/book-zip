import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  BookSummary,
  BookSummaryDocument,
} from '../books/schemas/book-summary.schema';
import { MailDeliveryService } from '../mail/mail-delivery.service';

@Injectable()
export class BookBatchService {
  private readonly logger = new Logger(BookBatchService.name);
  private isProcessing = false;

  constructor(
    @InjectModel(BookSummary.name)
    private bookSummaryModel: Model<BookSummaryDocument>,
    private mailDeliveryService: MailDeliveryService,
  ) {}

  /**
   * 매일 아침 7시에 책 요약 메일 발송
   */
  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendDailyBookSummary() {
    if (this.isProcessing) {
      this.logger.warn('이미 배치 작업이 실행 중입니다');
      return;
    }

    this.isProcessing = true;
    this.logger.log('일일 책 요약 메일 발송 시작...');

    try {
      // 오늘 보낼 책 선택 (미발송 또는 가장 오래전에 발송된 책)
      const book = await this.selectBookForToday();

      if (!book) {
        this.logger.warn('발송할 책이 없습니다');
        return;
      }

      const bookId = (book as any)._id.toString();
      this.logger.log(`오늘의 책: ${book.title} (ID: ${bookId})`);

      // 선택된 책 발송
      const result =
        await this.mailDeliveryService.sendDailyBookSummary(bookId);

      this.logger.log(
        `발송 완료 - 성공: ${result.success}, 실패: ${result.failed}`,
      );
    } catch (error) {
      this.logger.error(`배치 작업 오류: ${error.message}`, error.stack);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 수동으로 특정 책 발송 (관리자용)
   */
  async sendSpecificBook(
    bookId: string,
  ): Promise<{ success: number; failed: number }> {
    if (this.isProcessing) {
      throw new Error('이미 배치 작업이 실행 중입니다');
    }

    this.isProcessing = true;
    try {
      const book = await this.bookSummaryModel.findById(bookId);
      if (!book) {
        throw new Error(`책을 찾을 수 없습니다: ${bookId}`);
      }

      this.logger.log(`수동 발송 시작: ${book.title}`);
      return await this.mailDeliveryService.sendDailyBookSummary(bookId);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 오늘 보낼 책 선택 로직
   */
  private async selectBookForToday(): Promise<BookSummaryDocument | null> {
    // 1. 아직 발송되지 않은 책 중 가장 오래된 책 선택
    const unsentBook = await this.bookSummaryModel
      .findOne({ isSent: false })
      .sort({ createdAt: 1 })
      .exec();

    if (unsentBook) {
      return unsentBook;
    }

    // 2. 모든 책이 한 번 이상 발송됐다면, 가장 오래전에 발송된 책 선택
    const oldestSentBook = await this.bookSummaryModel
      .find()
      .sort({ lastSentAt: 1 })
      .limit(1)
      .exec();

    return oldestSentBook[0] || null;
  }
}
