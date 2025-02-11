// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface CreateUserDto {
  username: string;
  email: string;
  hashedPassword: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 새로운 사용자를 생성합니다.
   * @param data - 생성할 사용자 데이터 (비밀번호는 이미 해싱된 값)
   * @returns 생성된 사용자 객체
   */
  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: data.hashedPassword,
      },
    });
  }

  /**
   * 이메일로 사용자를 조회합니다.
   * @param email - 사용자의 이메일
   * @returns 사용자가 있으면 반환, 없으면 null
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * 사용자 ID로 사용자를 조회합니다.
   * @param userId - 사용자 ID
   * @returns 사용자 객체
   * @throws NotFoundException 사용자가 존재하지 않을 경우
   */
  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * 리프레시 토큰(plain text)을 해싱하여 해당 사용자의 DB 레코드에 저장합니다.
   * @param userId - 사용자 ID
   * @param refreshToken - 클라이언트로부터 받은 리프레시 토큰 (plain text)
   * @returns 업데이트된 사용자 객체
   */
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    return this.prisma.user.update({
      where: { user_id: userId },
      data: { refresh_token: hashedToken },
    });
  }
}
