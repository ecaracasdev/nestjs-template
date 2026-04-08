// logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { logger } from '../logger/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        logger.info({
          message: 'Request completed',
          method,
          url,
          statusCode: res.statusCode,
          duration: Date.now() - start,
        });
      }),
      catchError((err) => {
        logger.error({
          message: 'Request failed',
          method,
          url,
          error: err.message,
        });
        return throwError(() => err);
      }),
    );
  }
}
