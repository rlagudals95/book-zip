import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: Model<SubscriberDocument>,
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
}
