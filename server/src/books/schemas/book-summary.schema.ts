import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookSummaryDocument = BookSummary & Document;

@Schema({ timestamps: true })
export class BookSummary {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  coverImage: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ default: false })
  isSent: boolean; // 전체 발송 여부

  @Prop({ default: 0 })
  sentCount: number; // 총 발송 횟수

  @Prop({ type: Date })
  lastSentAt: Date; // 마지막 발송 시간
}

export const BookSummarySchema = SchemaFactory.createForClass(BookSummary);
