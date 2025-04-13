import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email.service';
import { VerificationService } from './verification.service';
import {
  Subscriber,
  SubscriberSchema,
} from '../subscriber/schemas/subscriber.schema';
import { Book, BookSchema } from '../book/schemas/book.schema';
import {
  Verification,
  VerificationSchema,
} from './schemas/verification.schema';
import { EmailController } from './email.controller';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Book.name, schema: BookSchema },
    ]),
  ],
  providers: [EmailService, VerificationService],
  exports: [EmailService, VerificationService],
  controllers: [EmailController],
})
export class EmailModule {}
