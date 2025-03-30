import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SummaryDocument = Summary & Document;

@Schema({ timestamps: true })
export class Summary {
  @ApiProperty({ description: '관련 책 ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Book', required: true })
  bookId: string;

  @ApiProperty({ description: '책 제목' })
  @Prop({ required: true })
  bookTitle: string;

  @ApiProperty({ description: '책 저자' })
  @Prop({ required: true })
  bookAuthor: string;

  @ApiProperty({ description: '요약 내용' })
  @Prop({ required: true })
  content: string;

  @ApiProperty({ description: '요약 관련 카테고리/태그 목록' })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ description: '요약 생성일' })
  @Prop({ default: Date.now })
  generatedAt: Date;
}

export const SummarySchema = SchemaFactory.createForClass(Summary);
