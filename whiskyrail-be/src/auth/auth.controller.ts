import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 토큰 재발급 엔드포인트 (리프레시 토큰)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    const userId = req.user.user_id;
    // 일반적으로 리프레시 토큰은 헤더의 Bearer 토큰 또는 Body로 전달합니다.
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
