export class UserProfileDto {
  userId: number;
  username: string;
  totalReviews: number;
  reviewsByType: { [caskType: string]: number };
  averageRating: number;
  highestRatingReview: {
    reviewId: number;
    overallRating: number;
    reviewText: string | null;
    whiskeyName: string | null;
    whiskeyImage?: string | null;
  } | null;
}
