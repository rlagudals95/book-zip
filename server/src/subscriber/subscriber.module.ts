import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribersController } from './subscriber.controller';
import { SubscribersService } from './subscriber.service';
import { Subscriber, SubscriberSchema } from './schemas/subscriber.schema';
import {
  Verification,
  VerificationSchema,
} from '../email/schemas/verification.schema';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Verification.name, schema: VerificationSchema },
    ]),
    EmailModule,
  ],
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}
