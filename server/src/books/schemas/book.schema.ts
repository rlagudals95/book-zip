import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @ApiProperty({ description: '책 제목' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: '저자' })
  @Prop({ required: true })
  author: string;

  @ApiProperty({ description: '출판사' })
  @Prop({ required: true })
  publisher: string;

  @ApiProperty({ description: '책 소개' })
  @Prop()
  description: string;

  @ApiProperty({ description: '표지 이미지 URL' })
  @Prop()
  coverImage: string;

  @ApiProperty({ description: '카테고리 목록' })
  @Prop({ type: [String], default: [] })
  categories: string[];

  @ApiProperty({ description: '태그 목록' })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ description: '출판 연도' })
  @Prop()
  publishYear: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
