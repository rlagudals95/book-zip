import { Controller, Post, Body } from '@nestjs/common';
import { BookBatchService } from './book-batch.service';

// 나중에 관리자 인증을 위한 가드를 구현할 예정
// import { AdminGuard } from '../auth/guards/admin.guard';

// 수동 발송을 위한 DTO
class SendBookDto {
  bookId: string;
}

@Controller('admin/batch')
// @UseGuards(AdminGuard) // 나중에 관리자 인증 추가 시 주석 해제
export class BookBatchController {
  constructor(private readonly bookBatchService: BookBatchService) {}

  /**
   * 오늘의 책 요약 수동 발송
   */
  @Post('send-today')
  async sendToday() {
    await this.bookBatchService.sendDailyBookSummary();
    return { message: '오늘의 책 발송 작업이 시작되었습니다' };
  }

  /**
   * 특정 책 요약 수동 발송
   */
  @Post('send-specific')
  async sendSpecific(@Body() dto: SendBookDto) {
    const result = await this.bookBatchService.sendSpecificBook(dto.bookId);
    return {
      message: '특정 책 발송 완료',
      success: result.success,
      failed: result.failed,
    };
  }
}
