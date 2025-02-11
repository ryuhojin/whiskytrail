import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // 회원가입: 사용자 생성 및 JWT 발급
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existingUser = await this.usersService.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // 비밀번호 해싱 (예: saltRounds = 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 생성 (Prisma 스키마의 모델 이름은 "users")
    const user = await this.usersService.createUser({
      username,
      email,
      hashedPassword,
    });

    // JWT 생성 (payload에 user_id와 email 포함)
    const payload = { sub: user.user_id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password_hash, ...result } = user;
    return result;
  }
  // 로그인: 사용자 검증 후 JWT 발급
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.user_id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}
