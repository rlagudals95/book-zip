import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email.service';
import { VerificationService } from './verification.service';
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
    ]),
  ],
  providers: [EmailService, VerificationService],
  exports: [EmailService, VerificationService],
  controllers: [EmailController],
})
export class EmailModule {}
