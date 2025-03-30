import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: '사용자 이메일' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: '사용자 이름' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: '소셜 로그인 제공자 (kakao, google, naver)' })
  @Prop({ required: true, enum: ['kakao', 'google', 'naver'] })
  provider: string;

  @ApiProperty({ description: '소셜 로그인 제공자의 ID' })
  @Prop({ required: true })
  providerId: string;

  @ApiProperty({ description: '프로필 이미지 URL' })
  @Prop()
  profileImage?: string;

  @ApiProperty({ description: '관심사 목록' })
  @Prop({ type: [String], default: [] })
  interests: string[];

  @ApiProperty({ description: '이메일 수신 동의 여부' })
  @Prop({ default: true })
  emailSubscription: boolean;

  @ApiProperty({ description: '이메일 수신 시간 (24시간 형식, 예: 09:00)' })
  @Prop({ default: '09:00' })
  emailDeliveryTime: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
