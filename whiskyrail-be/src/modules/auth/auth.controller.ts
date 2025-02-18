import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { accessCookieOptions, refrehCookiOptions } from './options';

@Controller('auth')
export class AuthController {
  userService: any;
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    const user = await this.authService.validteUser(
      loginDto.email,
      loginDto.password,
    );
    const { accessToken, refreshToken, payload } =
      await this.authService.login(user);

    res.cookie('accessToken', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refrehCookiOptions);

    return { payload };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req, // 타입 미지정
    @Res({ passthrough: true }) res,
  ) {
    // 일반적으로 리프레시 토큰은 헤더의 Bearer 토큰 또는 Body로 전달합니다.
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return;

    let payload: any;
    try {
      payload = await this.authService.verifyRefreshToken(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const userId = payload.sub;
    const tokens = await this.authService.refreshToken(userId, refreshToken);

    res.cookie('accessToken', tokens.accessToken, accessCookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, refrehCookiOptions);
    console.log(payload)
    return { payload };
  }

  @Post('logout')
  async logout(@GetUser() user: any, @Res({ passthrough: true }) res) {
    await this.authService.logout(user.user_id);
    res.clearCookie('accessToken', accessCookieOptions);
    res.clearCookie('refreshToken', refrehCookiOptions);
    return { message: 'Logged out successfully' };
  }
}
