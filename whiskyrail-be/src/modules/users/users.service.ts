// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserProfileDto } from './dto/user-profile.dto';

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
  async updateRefreshToken(userId: number, hashedToken: string | null) {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: { refresh_token: hashedToken },
    });
  }

  /**
   * 사용자 프로필 정보 집계 및 반환
   * @param userId - 사용자 ID
   * @returns 사용자 프로필 정보
   */
  async getUserProfile(userId: number): Promise<UserProfileDto> {
    // 1. 사용자 기본 정보 조회
    const user = await this.findById(userId);

    // 2. 총 리뷰 수
    const totalReviews = await this.prisma.reviews.count({
      where: { user_id: userId },
    });

    // 3. 평균 평점 집계 (overall_rating)
    const ratingAggregate = await this.prisma.reviews.aggregate({
      _avg: { overall_rating: true },
      where: { user_id: userId },
    });
    const averageRating =
      ratingAggregate._avg.overall_rating !== null
        ? Number(ratingAggregate._avg.overall_rating)
        : 0;

    // 4. 최고 평점 리뷰 조회 (관련 위스키와 이미지 포함)
    const highestReview = await this.prisma.reviews.findFirst({
      where: { user_id: userId },
      orderBy: { overall_rating: 'desc' },
      include: {
        whiskeys: {
          include: { whiskeyimages: true },
        },
      },
    });
    let highestRatingReview: UserProfileDto['highestRatingReview'] = null;
    if (highestReview) {
      highestRatingReview = {
        reviewId: highestReview.review_id,
        overallRating:
          highestReview.overall_rating !== null
            ? Number(highestReview.overall_rating)
            : 0,
        reviewText: highestReview.review_text || null,
        whiskeyName: highestReview.whiskeys
          ? highestReview.whiskeys.name
          : null,
        whiskeyImage:
          highestReview.whiskeys &&
          highestReview.whiskeys.whiskeyimages &&
          highestReview.whiskeys.whiskeyimages.length > 0
            ? highestReview.whiskeys.whiskeyimages[0].image_url
            : null,
      };
    }

    // 5. 위스키 타입별 리뷰 수 집계
    // 각 리뷰의 연결된 위스키의 cask_type 기준으로 그룹화 (없으면 "Others")
    const reviews = await this.prisma.reviews.findMany({
      where: { user_id: userId },
      include: { whiskeys: true },
    });
    const reviewsByType: { [caskType: string]: number } = {};
    reviews.forEach((review) => {
      const type =
        review.whiskeys && review.whiskeys.cask_type
          ? review.whiskeys.cask_type
          : 'Others';
      reviewsByType[type] = (reviewsByType[type] || 0) + 1;
    });

    // 6. 최종 프로필 DTO 구성
    const profile: UserProfileDto = {
      userId: user.user_id,
      username: user.username,
      totalReviews,
      reviewsByType,
      averageRating,
      highestRatingReview,
    };

    return profile;
  }
}
