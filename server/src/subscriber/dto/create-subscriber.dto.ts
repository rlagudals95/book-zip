import { IsEmail, IsArray, IsOptional } from 'class-validator';

export class CreateSubscriberDto {
  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional()
  interests?: string[];
}
