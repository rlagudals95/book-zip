import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';

import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { Subscriber } from './schemas/subscriber.schema';
import { SubscribersService } from './subscriber.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  async create(
    @Body() createSubscriberDto: CreateSubscriberDto,
  ): Promise<Subscriber> {
    return this.subscribersService.create(createSubscriberDto);
  }

  @Get()
  async findAll(): Promise<Subscriber[]> {
    return this.subscribersService.findAll();
  }

  @Get(':email')
  async findOne(@Param('email') email: string): Promise<Subscriber> {
    return this.subscribersService.findByEmail(email);
  }

  @Patch(':email')
  async update(
    @Param('email') email: string,
    @Body('interests') interests: string[],
  ): Promise<Subscriber> {
    return this.subscribersService.update(email, interests);
  }

  @Delete(':email')
  @HttpCode(204)
  async unsubscribe(@Param('email') email: string): Promise<Subscriber> {
    return this.subscribersService.unsubscribe(email);
  }
}
