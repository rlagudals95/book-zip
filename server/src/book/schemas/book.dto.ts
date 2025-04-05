import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsISBN,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: '책 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '국제표준 도서 ISBN 번호' })
  @IsString()
  @IsISBN()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ description: '저자' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ description: '책 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '출판사' })
  @IsString()
  @IsOptional()
  publisher?: string;

  @ApiPropertyOptional({ description: '출판 연도' })
  @IsNumber()
  @IsOptional()
  publishedYear?: number;

  @ApiPropertyOptional({ description: '카테고리 목록' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({ description: '책 표지 이미지 URL' })
  @IsString()
  @IsOptional()
  coverImage?: string;
}

export class UpdateBookDto {
  @ApiPropertyOptional({ description: '책 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '저자' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ description: '책 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '출판사' })
  @IsString()
  @IsOptional()
  publisher?: string;

  @ApiPropertyOptional({ description: '출판 연도' })
  @IsNumber()
  @IsOptional()
  publishedYear?: number;

  @ApiPropertyOptional({ description: '카테고리 목록' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({ description: '책 표지 이미지 URL' })
  @IsString()
  @IsOptional()
  coverImage?: string;
}

// 책 요약 관련 DTO
export class BookSummaryDto {
  @ApiProperty({ description: '요약 내용' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ description: '핵심 포인트 목록' })
  @IsArray()
  @IsString({ each: true })
  keyPoints: string[];

  @ApiProperty({ description: '읽는 데 소요되는 시간' })
  @IsString()
  readingTime: string;
}

// 책 응답 시 사용할 DTO (모든 필드 포함)
export class BookResponseDto {
  @ApiProperty({ description: '책 ID' })
  id: string;

  @ApiProperty({ description: '책 제목' })
  title: string;

  @ApiProperty({ description: '국제표준 도서 ISBN 번호' })
  isbn: string;

  @ApiProperty({ description: '저자' })
  author: string;

  @ApiPropertyOptional({ description: '책 설명' })
  description?: string;

  @ApiPropertyOptional({ description: '출판사' })
  publisher?: string;

  @ApiPropertyOptional({ description: '출판 연도' })
  publishedYear?: number;

  @ApiProperty({ description: '요약 여부' })
  isSummarized: boolean;

  @ApiPropertyOptional({ description: '카테고리 목록' })
  categories?: string[];

  @ApiPropertyOptional({ description: '책 표지 이미지 URL' })
  coverImage?: string;

  @ApiPropertyOptional({ description: '요약 내용', type: 'string' })
  summary?: string;

  @ApiPropertyOptional({
    description: '핵심 포인트 목록',
    type: 'string',
    isArray: true,
  })
  keyPoints?: string[];

  @ApiPropertyOptional({ description: '읽는 데 소요되는 시간' })
  readingTime?: string;

  @ApiPropertyOptional({ description: '요약 생성 일시' })
  summarizedAt?: Date;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;
}

// 책 목록 조회용 간소화된 DTO
export class BookListItemDto {
  @ApiProperty({ description: '책 ID' })
  id: string;

  @ApiProperty({ description: '책 제목' })
  title: string;

  @ApiProperty({ description: '저자' })
  author: string;

  @ApiPropertyOptional({ description: '책 표지 이미지 URL' })
  coverImage?: string;

  @ApiProperty({ description: '요약 여부' })
  isSummarized: boolean;

  @ApiPropertyOptional({ description: '카테고리 목록' })
  categories?: string[];

  @ApiPropertyOptional({ description: '읽는 데 소요되는 시간' })
  readingTime?: string;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}

// 책 요약 생성 요청용 DTO
export class GenerateBookSummaryDto {
  @ApiProperty({ description: '책 ID' })
  @IsString()
  @IsNotEmpty()
  bookId: string;
}
