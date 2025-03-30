import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SummaryService } from './summary.service';

import { Summary, SummarySchema } from './schemas/summary.schema';
import { BooksModule } from '../books/books.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { DailySummaryTask } from './tasks/daily-summary.task';
import { SummaryController } from './summary.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Summary.name, schema: SummarySchema }]),
    BooksModule,
    EmailModule,
    UsersModule,
  ],
  controllers: [SummaryController],
  providers: [SummaryService, DailySummaryTask],
  exports: [SummaryService],
})
export class SummaryModule {}
