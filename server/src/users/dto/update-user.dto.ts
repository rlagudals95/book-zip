import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '사용자 이름', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '관심사 목록', required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({ description: '이메일 수신 동의 여부', required: false })
  @IsBoolean()
  @IsOptional()
  emailSubscription?: boolean;

  @ApiProperty({
    description: '이메일 수신 시간 (24시간 형식, 예: 09:00)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: '이메일 수신 시간은 HH:MM 형식이어야 합니다.',
  })
  emailDeliveryTime?: string;
}
