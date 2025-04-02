import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Verification,
  VerificationDocument,
} from './schemas/verification.schema';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>,
  ) {}

  /**
   * 인증 코드 생성 (6자리 숫자)
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 이메일에 대한 인증 코드 저장
   * @param email 이메일 주소
   * @param code 인증 코드
   */
  async saveVerificationCode(email: string, code: string): Promise<void> {
    try {
      // 기존 코드가 있다면 삭제
      await this.verificationModel.findOneAndDelete({ email }).exec();

      // 새 코드 저장
      await this.verificationModel.create({
        email,
        code,
        createdAt: new Date(),
      });

      this.logger.log(`인증 코드 저장 완료: ${email}`);
    } catch (error) {
      this.logger.error(`인증 코드 저장 오류: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 인증 코드 확인
   * @param email 이메일 주소
   * @param code 사용자가 입력한 인증 코드
   * @returns 인증 코드 일치 여부
   */
  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      const verification = await this.verificationModel
        .findOne({
          email,
          code,
        })
        .exec();

      return !!verification; // 존재하면 true, 없으면 false
    } catch (error) {
      this.logger.error(`인증 코드 확인 오류: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * 인증 코드 삭제 (인증 성공 후 호출)
   * @param email 이메일 주소
   */
  async deleteVerificationCode(email: string): Promise<void> {
    try {
      await this.verificationModel.findOneAndDelete({ email }).exec();
      this.logger.log(`인증 코드 삭제 완료: ${email}`);
    } catch (error) {
      this.logger.error(`인증 코드 삭제 오류: ${error.message}`, error.stack);
      throw error;
    }
  }
}
