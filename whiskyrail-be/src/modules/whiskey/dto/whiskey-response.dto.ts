export class WhiskeyResponseDto {
  whiskeyId: number;
  name: string;
  age?: number | null;
  isIndependentBottled?: boolean;
  isLimitedEdition?: boolean;
  caskType?: string;
  price?: number;
  description?: string;
  releaseDate?: Date;
  distillery?: {
    distilleryId: number;
    name: string;
    location?: string;
    establishedYear?: number;
    website?: string;
  } | null;
  independentBottler?: {
    bottlerId: number;
    name: string;
    location?: string;
    establishedYear?: number;
    description?: string;
  } | null;
  images: string[]; // 이미지 URL 배열 (예: 전체 이미지 혹은 대표 이미지)
  tags: { tagId: number; name: string }[];
}
