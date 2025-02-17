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
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain:
        process.env.NODE_ENV === 'production' ? '.whiskyrail.com' : undefined,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return { accessToken, payload };
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
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let decode: any;
    try {
      decode = this.authService.verifyRefreshToken(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const userId = decode.sub;
    const tokens = await this.authService.refreshToken(userId, refreshToken);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain:
        process.env.NODE_ENV === 'production' ? '.whiskyrail.com' : undefined,
    };
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@GetUser() user: any, @Res({ passthrough: true }) res) {
    await this.authService.logout(user.user_id);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain:
        process.env.NODE_ENV === 'production' ? '.whiskyrail.com' : undefined,
    });
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Get('me')
  async getMe(@Req() req, @Res({ passthrough: true }) res) {
    const authHeader = req.header.authorization;
    let accessToken: string;
    let user: any;

    if(authHeader && authHeader.startWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1];

      try {

      } catch (e) {
        
      }
    }
  }
}
