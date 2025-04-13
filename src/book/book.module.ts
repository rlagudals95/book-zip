import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { BookService } from './book.service';
import { BookGenerationService } from './book-generation.service';
import { BookController } from './book.controller';
import { BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
    ScheduleModule.forRoot(),
    HttpModule,
    ConfigModule,
  ],
  controllers: [BookController],
  providers: [BookService, BookGenerationService],
  exports: [BookService, BookGenerationService],
})
export class BookModule {}
