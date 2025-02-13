import { IsOptional, IsInt, IsBoolean, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetWhiskiesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  age?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  distilleryId?: number;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  caskType?: string;

  @IsOptional()
  @IsBoolean()
  isLimitedEdition?: boolean;

  @IsOptional()
  @IsBoolean()
  isIndependentBottled?: boolean;
}
