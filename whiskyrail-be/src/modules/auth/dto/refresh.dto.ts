import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty({ message: '리프레시 토큰을 입력하세요.' })
  refreshToken: string;
}
