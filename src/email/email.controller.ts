import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './email.service';

import {
  RequestVerificationDto,
  VerifyEmailDto,
} from './schemas/verify-email.schema';
import { VerificationService } from './verification.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly verificationService: VerificationService,
  ) {}

  @Post('request-verification')
  @HttpCode(HttpStatus.OK)
  async requestVerification(@Body() dto: RequestVerificationDto) {
    // 인증 코드 생성
    const verificationCode =
      this.verificationService.generateVerificationCode();

    // 인증 코드 저장
    await this.verificationService.saveVerificationCode(
      dto.email,
      verificationCode,
    );

    // 이메일 발송
    const emailSent = await this.emailService.sendVerificationCode(
      dto.email,
      verificationCode,
    );

    if (!emailSent) {
      throw new BadRequestException('이메일 발송에 실패했습니다');
    }

    return { success: true, message: '인증 코드가 이메일로 전송되었습니다' };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    // 인증 코드 확인
    const isValid = await this.verificationService.verifyCode(
      dto.email,
      dto.code,
    );

    if (!isValid) {
      throw new BadRequestException('유효하지 않은 인증 코드입니다');
    }

    // 인증 성공 시 코드 삭제
    await this.verificationService.deleteVerificationCode(dto.email);

    return { success: true, message: '이메일 인증이 완료되었습니다' };
  }

  @Post('send-summary-email')
  @HttpCode(HttpStatus.OK)
  async sendSummaryEmail() {
    await this.emailService.sendSummaryEmail();
  }
}
