// src/common/interceptors/cookie.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // HTTP 어댑터에 상관없이 추상화된 응답 객체를 가져옵니다.
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap((data) => {
        if (data && data.accessToken && data.refreshToken) {
          // 쿠키 문자열 생성 (여기서는 예시로 15분, 7일로 설정)
          const accessCookie = `access_token=${data.accessToken}; HttpOnly; Path=/; Max-Age=900;`;
          const refreshCookie = `refresh_token=${data.refreshToken}; HttpOnly; Path=/; Max-Age=604800;`;
          // Set-Cookie 헤더를 설정 (Express나 Fastify 모두 지원하는 방식)
          response.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
        }
      }),
    );
  }
}
