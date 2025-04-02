import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { RequestVerificationDto } from './schemas/verify-email.schema';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('request-verification')
  @HttpCode(HttpStatus.OK)
  async requestVerification(@Body() dto: RequestVerificationDto) {
    // 6자리 인증 코드 생성
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // 이전 코드 삭제 및 새 코드 저장
    await this.emailService.sendVerificationCode(dto.email, verificationCode);

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
}
