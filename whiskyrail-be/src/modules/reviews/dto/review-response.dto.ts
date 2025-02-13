export class ReviewResponseDto {
  reviewId: number;
  overallRating: number;
  reviewText: string;
  createdAt: Date;
  reviewer: {
    userId: number;
    username: string;
  } | null;
  whiskey: {
    whiskeyId: number;
    name: string;
    primaryImage: string | null;
  } | null;
}
