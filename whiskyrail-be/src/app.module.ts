import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { WhiskeyModule } from './modules/whiskey/whiskey.module';
import { ReviewsService } from './modules/reviews/reviews.service';
import { ReviewsController } from './modules/reviews/reviews.controller';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WhiskeyModule,
    ReviewsModule,
  ],
  controllers: [AppController, ReviewsController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ReviewsService,
  ],
})
export class AppModule {}
