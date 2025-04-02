import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { BookBatchService } from './book-batch.service';

import {
  BookSummary,
  BookSummarySchema,
} from '../books/schemas/book-summary.schema';
import { MailModule } from 'src/mail/mail.module';
import { BookBatchController } from './book-batch.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: BookSummary.name, schema: BookSummarySchema },
    ]),
    MailModule,
  ],
  providers: [BookBatchService],
  controllers: [BookBatchController],
  exports: [BookBatchService],
})
export class BookBatchModule {}
