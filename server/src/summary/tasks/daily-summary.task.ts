import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SummaryService } from '../summary.service';
import { UsersService } from '../../users/users.service';
import { EmailService } from '../../email/email.service';

interface ScheduledTime {
  hour: number;
  minute: number;
}

@Injectable()
export class DailySummaryTask {
  private readonly logger = new Logger(DailySummaryTask.name);
  private scheduledDeliveries = new Map<string, ScheduledTime>(); // 시간 => 사용자 ID 매핑

  constructor(
    private summaryService: SummaryService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {
    // 초기 배달 시간 설정
    void this.initializeDeliverySchedule();
  }

  // 5분마다 실행하여 이메일 발송이 필요한지 확인
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkDeliveryTimes() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = Math.floor(now.getMinutes() / 5) * 5; // 5분 단위로 반올림

    // 현재 시간대에 이메일을 받기로 한 사용자들을 찾음
    const timeKey = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;

    if (currentMinute % 5 === 0) {
      this.logger.log(`이메일 배달 시간 확인 중: ${timeKey}`);
      await this.sendEmailsForTimeSlot(currentHour, currentMinute);
    }
  }

  // 매일 자정에 배달 스케줄 업데이트
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateDeliverySchedule() {
    this.logger.log('일일 이메일 배달 스케줄 업데이트 중...');
    await this.initializeDeliverySchedule();
  }

  // 사용자의 이메일 배달 시간 기반으로 스케줄 초기화
  private async initializeDeliverySchedule() {
    try {
      // 이메일 수신을 원하는 모든 사용자 조회
      const users = await this.usersService.findAllWithEmailSubscription();
      this.scheduledDeliveries.clear();

      for (const user of users) {
        const [hourStr, minuteStr] = user.emailDeliveryTime.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        // 가장 가까운 5분 단위로 반올림
        const roundedMinute = Math.round(minute / 5) * 5;
        const timeKey = `${hour}:${roundedMinute.toString().padStart(2, '0')}`;

        this.scheduledDeliveries.set(timeKey, { hour, minute: roundedMinute });
        this.logger.log(
          `사용자 ${user.email}의 배달 시간이 ${timeKey}로 설정되었습니다.`,
        );
      }
    } catch (error) {
      this.logger.error('배달 스케줄 초기화 중 오류 발생:', error.stack);
    }
  }

  // 특정 시간대에 이메일 발송
  private async sendEmailsForTimeSlot(hour: number, minute: number) {
    try {
      const timeKey = `${hour}:${minute.toString().padStart(2, '0')}`;

      // 이 시간에 이메일을 받을 사용자 찾기
      const users = await this.usersService.findAllWithEmailSubscription();
      const targetUsers = users.filter((user) => {
        const [userHour, userMinute] = user.emailDeliveryTime
          .split(':')
          .map((num) => parseInt(num, 10));
        const userRoundedMinute = Math.round(userMinute / 5) * 5;
        return userHour === hour && userRoundedMinute === minute;
      });

      if (targetUsers.length === 0) {
        return;
      }

      this.logger.log(
        `${timeKey}에 ${targetUsers.length}명의 사용자에게 메일 발송 중...`,
      );

      // 각 사용자마다 관심사 기반 요약 생성 및 이메일 발송
      for (const user of targetUsers) {
        // 사용자의 관심사에 맞는 요약 생성
        const summary = await this.summaryService.generateSummaryByInterests(
          user.interests,
        );

        if (summary) {
          // 이메일 발송
          await this.emailService.sendBookSummary(
            user.email,
            user.name,
            summary.bookTitle,
            summary.content,
          );
          this.logger.log(
            `사용자 ${user.email}에게 '${summary.bookTitle}' 요약이 발송되었습니다.`,
          );
        } else {
          this.logger.warn(
            `사용자 ${user.email}을 위한 요약을 생성할 수 없었습니다.`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `이메일 발송 중 오류 발생: ${error.message}`,
        error.stack,
      );
    }
  }
}
