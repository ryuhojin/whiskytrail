import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewResponseDto } from './dto/review-response.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews(): Promise<ReviewResponseDto[]> {
    return this.reviewsService.getReviewList();
  }
}
