import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client'; // Optional: 타입으로 사용

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 단일 사용자 조회
  async getUserById(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async createUser(data: {
    username: string;
    email: string;
    hashedPassword: string;
  }) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: data.hashedPassword,
      },
    });
  }

  // 전체 사용자 목록 조회
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // 사용자 정보 업데이트
  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { user_id: userId },
      data,
    });
  }

  // 사용자 삭제 (옵션)
  async deleteUser(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { user_id: userId },
    });
  }
}
