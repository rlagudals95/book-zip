import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriberDocument = Subscriber & Document;

@Schema({ timestamps: true })
export class Subscriber {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop({ default: true })
  isActive: boolean;

  // 보낸 책 요약 기록
  @Prop({
    type: [
      {
        bookId: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  sentBooks: { bookId: string; sentAt: Date }[];
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
