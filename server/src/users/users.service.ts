import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByProviderAndProviderId(
    provider: string,
    providerId: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ provider, providerId }).exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  async findAllWithEmailSubscription(): Promise<UserDocument[]> {
    return this.userModel.find({ emailSubscription: true }).exec();
  }

  async updateInterests(
    userId: string,
    interests: string[],
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { interests }, { new: true })
      .exec();
  }
}
