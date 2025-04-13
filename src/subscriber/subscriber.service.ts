import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import {
  Verification,
  VerificationDocument,
} from '../email/schemas/verification.schema';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import {
  VerifyEmailDto,
  RequestVerificationDto,
} from '../email/schemas/verify-email.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: Model<SubscriberDocument>,
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>,
    private emailService: EmailService,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto): Promise<Subscriber> {
    const existingSubscriber = await this.subscriberModel
      .findOne({
        email: createSubscriberDto.email,
      })
      .exec();

    if (existingSubscriber) {
      throw new ConflictException('이미 구독 중인 이메일입니다');
    }

    const newSubscriber = new this.subscriberModel(createSubscriberDto);
    return newSubscriber.save();
  }

  async findAll(): Promise<Subscriber[]> {
    return this.subscriberModel.find().exec();
  }

  async findByEmail(email: string): Promise<Subscriber> {
    return this.subscriberModel.findOne({ email }).exec();
  }

  async update(email: string, interests: string[]): Promise<Subscriber> {
    return this.subscriberModel
      .findOneAndUpdate({ email }, { interests }, { new: true })
      .exec();
  }

  async unsubscribe(email: string): Promise<Subscriber> {
    return this.subscriberModel
      .findOneAndUpdate({ email }, { isActive: false }, { new: true })
      .exec();
  }

  async requestVerification(
    dto: RequestVerificationDto,
  ): Promise<{ success: boolean }> {
    const existingSubscriber = await this.subscriberModel
      .findOne({ email: dto.email })
      .exec();
    if (existingSubscriber) {
      throw new ConflictException('이미 구독 중인 이메일입니다');
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.verificationModel.findOneAndDelete({ email: dto.email }).exec();
    await this.verificationModel.create({
      email: dto.email,
      code: verificationCode,
    });

    const emailSent = await this.emailService.sendVerificationCode(
      dto.email,
      verificationCode,
    );
    if (!emailSent) {
      throw new BadRequestException('이메일 발송에 실패했습니다');
    }

    return { success: true };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ success: boolean }> {
    const verification = await this.verificationModel
      .findOne({
        email: dto.email,
        code: dto.code,
      })
      .exec();

    if (!verification) {
      throw new BadRequestException('유효하지 않은 인증 코드입니다');
    }

    await this.verificationModel.findByIdAndDelete(verification._id).exec();

    return { success: true };
  }

  async createAfterVerification(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<Subscriber> {
    const newSubscriber = new this.subscriberModel(createSubscriberDto);
    return newSubscriber.save();
  }
}
