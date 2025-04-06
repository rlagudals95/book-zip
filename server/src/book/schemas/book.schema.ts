import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  @ApiProperty({ description: '국제표준 도서 ISBN 번호' })
  isbn: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  description: string;

  @Prop()
  publisher: string;

  @Prop()
  publishedYear: number;

  @Prop({ default: false })
  isSummarized: boolean;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop()
  coverImage: string;

  // 요약 관련 필드들
  @Prop()
  summary: string;

  @Prop({ type: [String], default: [] })
  keyPoints: string[];

  @Prop()
  readingTime: string;

  @Prop()
  link: string;

  @Prop({ default: false })
  isSent: boolean;

  @Prop({ type: Date })
  sendAt: Date;

  @Prop({ type: Date })
  summarizedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
