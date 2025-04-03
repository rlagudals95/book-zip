import { IsEmail, IsArray, IsOptional } from 'class-validator';
import { Interest } from '../types';

export class CreateSubscriberDto {
  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional()
  interests?: Interest[];
}
