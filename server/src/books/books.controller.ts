import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: '모든 책 조회' })
  @ApiResponse({
    status: 200,
    description: '책 목록',
    type: [Book],
  })
  async findAll() {
    return await this.booksService.findAll();
  }

  @Get('categories')
  @ApiOperation({ summary: '카테고리별 책 조회' })
  @ApiResponse({
    status: 200,
    description: '카테고리에 해당하는 책 목록',
    type: [Book],
  })
  async findByCategories(@Query('categories') categories: string[]) {
    return await this.booksService.findByCategories(categories);
  }

  @Get('tags')
  @ApiOperation({ summary: '태그별 책 조회' })
  @ApiResponse({
    status: 200,
    description: '태그에 해당하는 책 목록',
    type: [Book],
  })
  async findByTags(@Query('tags') tags: string[]) {
    return await this.booksService.findByTags(tags);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 책 조회' })
  @ApiParam({ name: 'id', description: '책 ID' })
  @ApiResponse({
    status: 200,
    description: '책 정보',
    type: Book,
  })
  async findOne(@Param('id') id: string) {
    return await this.booksService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '책 등록' })
  @ApiResponse({
    status: 201,
    description: '생성된 책 정보',
    type: Book,
  })
  async create(@Body() bookData: Partial<Book>) {
    return await this.booksService.create(bookData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '책 정보 수정' })
  @ApiParam({ name: 'id', description: '책 ID' })
  @ApiResponse({
    status: 200,
    description: '수정된 책 정보',
    type: Book,
  })
  async update(@Param('id') id: string, @Body() bookData: Partial<Book>) {
    return await this.booksService.update(id, bookData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '책 삭제' })
  @ApiParam({ name: 'id', description: '책 ID' })
  @ApiResponse({
    status: 200,
    description: '삭제 성공 여부',
  })
  async remove(@Param('id') id: string) {
    return {
      success: await this.booksService.remove(id),
    };
  }
}
