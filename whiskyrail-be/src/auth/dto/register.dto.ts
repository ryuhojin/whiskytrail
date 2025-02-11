import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class RegisterDto {
  @IsNotEmpty({ message: '사용자 이름을 입력하세요.' })
  username: string;

  @IsEmail({}, { message: '유효한 이메일 주소를 입력하세요.' })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력하세요.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|]).+$/,
    {
      message:
        '비밀번호는 최소 하나의 대문자, 소문자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;

  @IsNotEmpty({ message: '비밀번호 확인을 입력하세요.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Match('password', { message: '비밀번호가 일치하지 않습니다.' })
  passwordConfirmation: string;
}
