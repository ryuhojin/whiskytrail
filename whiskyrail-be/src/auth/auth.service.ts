import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // 토큰 생성 함수 (액세스 토큰과 리프레시 토큰 발급)
  private generateTokens(user: any) {
    const payload = { sub: user.user_id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password, passwordConfirmation } = registerDto;
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      username,
      email,
      hashedPassword,
    });
    const tokens = this.generateTokens(user);
    // DB에 해싱된 리프레시 토큰 저장
    await this.usersService.updateRefreshToken(
      user.user_id,
      tokens.refreshToken,
    );
    return { user, ...tokens };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = this.generateTokens(user);
    // DB에 리프레시 토큰 업데이트
    await this.usersService.updateRefreshToken(
      user.user_id,
      tokens.refreshToken,
    );
    return { user, ...tokens };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user.refresh_token) {
      throw new UnauthorizedException('No refresh token found');
    }
    const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokens = this.generateTokens(user);
    await this.usersService.updateRefreshToken(
      user.user_id,
      tokens.refreshToken,
    );
    return tokens;
  }
}
