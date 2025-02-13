import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewResponseDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReviewList(): Promise<ReviewResponseDto[]> {
    const reviews = await this.prisma.reviews.findMany({
      include: {
        // 작성자 정보
        user: true,
        // 위스키 정보와 그에 연결된 이미지(대표 이미지만)
        whiskeys: {
          include: {
            whiskeyimages: {
              where: { is_primary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return reviews.map((review) => {
      return {
        reviewId: review.review_id,
        overallRating: review.overall_rating
          ? Number(review.overall_rating)
          : 0,
        reviewText: review.review_text || '',
        createdAt: review.created_at || new Date(),
        reviewer: review.user
          ? {
              userId: review.user.user_id,
              username: review.user.username,
            }
          : null,
        whiskey: review.whiskeys
          ? {
              whiskeyId: review.whiskeys.whiskey_id,
              name: review.whiskeys.name,
              primaryImage:
                review.whiskeys.whiskeyimages.length > 0
                  ? review.whiskeys.whiskeyimages[0].image_url
                  : null,
            }
          : null,
      } as ReviewResponseDto;
    });
  }
}
