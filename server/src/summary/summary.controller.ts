import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SummaryService } from './summary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Summary } from './schemas/summary.schema';

@ApiTags('summary')
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  @ApiOperation({ summary: '모든 요약 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 요약 목록',
    type: [Summary],
  })
  async findAll() {
    return await this.summaryService.findAll();
  }

  @Get('book/:bookId')
  @ApiOperation({ summary: '특정 책의 요약 조회' })
  @ApiParam({ name: 'bookId', description: '책 ID' })
  @ApiResponse({
    status: 200,
    description: '해당 책의 요약 목록',
    type: [Summary],
  })
  async findByBookId(@Param('bookId') bookId: string) {
    return await this.summaryService.findByBookId(bookId);
  }

  @Get('tags')
  @ApiOperation({ summary: '태그별 요약 조회' })
  @ApiQuery({ name: 'tags', description: '태그 목록', type: [String] })
  @ApiResponse({
    status: 200,
    description: '태그에 해당하는 요약 목록',
    type: [Summary],
  })
  async findByTags(@Query('tags') tags: string[]) {
    return await this.summaryService.findByTags(tags);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 요약 조회' })
  @ApiParam({ name: 'id', description: '요약 ID' })
  @ApiResponse({
    status: 200,
    description: '요약 정보',
    type: Summary,
  })
  async findOne(@Param('id') id: string) {
    return await this.summaryService.findById(id);
  }

  @Post('generate/book/:bookId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 책의 요약 생성' })
  @ApiParam({ name: 'bookId', description: '책 ID' })
  @ApiResponse({
    status: 201,
    description: '생성된 요약 정보',
    type: Summary,
  })
  async generateSummary(@Param('bookId') bookId: string) {
    return await this.summaryService.generateSummary(bookId);
  }

  @Post('generate/interests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '관심사 기반 요약 생성' })
  @ApiResponse({
    status: 201,
    description: '관심사 기반으로 생성된 요약 정보',
    type: Summary,
  })
  async generateSummaryByInterests(
    @Request() req: { user: { id: string; interests?: string[] } },
  ) {
    const interests = req.user.interests || [];
    return await this.summaryService.generateSummaryByInterests(interests);
  }
}
