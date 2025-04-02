import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailDeliveryService } from './mail-delivery.service';
import {
  Subscriber,
  SubscriberSchema,
} from '../subscriber/schemas/subscriber.schema';
import {
  BookSummary,
  BookSummarySchema,
} from '../books/schemas/book-summary.schema';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: BookSummary.name, schema: BookSummarySchema },
    ]),
    EmailModule,
  ],
  providers: [MailDeliveryService],
  exports: [MailDeliveryService],
})
export class MailModule {}
