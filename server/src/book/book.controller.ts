import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { BookGenerationService } from './book-generation.service';
import { CreateBookDto } from './schemas/book.dto';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly bookGenerationService: BookGenerationService,
  ) {}

  @Get()
  async findAll(@Query('summarized') summarized?: string) {
    if (summarized === 'true') {
      return this.bookService.findSummarizedBooks();
    } else if (summarized === 'false') {
      return this.bookService.findUnsummarizedBooks();
    }
    return this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findById(id);
  }

  // 테스트용 책 생성 엔드포인트
  @Post('create')
  // @UseGuards(AdminGuard) // 필요시 관리자 권한 체크
  async createTestBook(@Body() bookData: CreateBookDto) {
    return this.bookService.createBook(bookData);
  }

  // 테스트용 요약 생성 엔드포인트
  @Post('test/generate-summary/:bookId')
  // @UseGuards(AdminGuard) // 필요시 관리자 권한 체크
  async generateSummary(@Param('bookId') bookId: string) {
    return this.bookGenerationService.generateBookSummaryManually(bookId);
  }

  @Post('create-new-book')
  async fetchAndCreateNewBook() {
    return await this.bookGenerationService.fetchAndCreateNewBook();
  }

  // 스케줄링된 작업 수동 실행 엔드포인트
  @Post('admin/generate-daily-summary')
  //@UseGuards(AdminGuard)
  async generateDailySummary() {
    await this.bookGenerationService.generateDailyBookSummary();
    return { success: true, message: '일일 책 요약 생성이 시작되었습니다.' };
  }
}
