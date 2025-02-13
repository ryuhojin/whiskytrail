import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger, ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CookieInterceptor } from './common/interceptors/cookie.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'WhiskyRail',
    }),
  });

  // const configDocument = new DocumentBuilder()
  //   .setTitle('WhiskyRail API')
  //   .setDescription('WhiskyRail API 문서입니다.')
  //   .build();
  // const documentFactory = () =>
  //   SwaggerModule.createDocument(app, configDocument);

  // SwaggerModule.setup('api/docs', app, documentFactory(), {
  // });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV');
  const databaseUrl = configService.get<string>('DATABASE_URL');

  Logger.log(`===============================================`);
  Logger.log(
    `WHISKY RAIL 서버는 현재 ${process.env.PORT ?? 3000} 포트에서 실행중입니다.`,
  );
  Logger.log(
    `WHISKY RAIL 실행환경은 ${nodeEnv == 'development' ? '개발' : '운영'} 입니다.`,
  );
  Logger.log(
    `WHISKY RAIL 현재 연결된 데이터베이스 주소는 [${databaseUrl}] 입니다.`,
  );
  Logger.log(`===============================================`);

  // 전역 접두사 : 모든 API 엔드포인트에 /api를 추가  (예: /api/auth/login)
  app.setGlobalPrefix('api');
  // 전역 파이프 : 모든 요청의 Body, Query, Param 등을 자동으로 유효성 검사
  app.useGlobalPipes(new ValidationPipe());
  // 전역 인터셉터 적용 : 모든 요청을 로깅
  app.useGlobalInterceptors(new LoggingInterceptor());
  // 전역 인터셉터 적용 : 모든 응답을 공통 응답으로 변환
  app.useGlobalInterceptors(new TransformInterceptor());
  // 전역 예외 필터 적용 : 모든 에러 응답을 공통 에러 응답으로 변환
  app.useGlobalFilters(new AllExceptionsFilter());
  // 글로벌 인터셉터 등록: 모든 응답에 대해 쿠키 설정을 처리합니다.
  app.useGlobalInterceptors(new CookieInterceptor());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
