import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// randomUUID polyfill (Node.js v18.x에서 @nestjs/schedule 호환성 문제 해결)
import * as crypto from 'crypto';
// @ts-expect-error - global.crypto 타입 정의 충돌
if (!global.crypto) global.crypto = {};
if (!global.crypto.randomUUID)
  global.crypto.randomUUID = () => crypto.randomUUID();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS 설정
  app.enableCors();

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('매일북집 API')
    .setDescription('매일북집 API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
