// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Logger } from 'pino'; // Solo para tipado
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Nest se encarga de pasarte la instancia aquí
  constructor(@Inject('LOGGER') private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        this.logger.info({
          // Ahora usas "this.logger"
          message: 'Request completed',
          method,
          url,
          statusCode: res.statusCode,
          duration: Date.now() - start,
        });
      }),
      catchError((err) => {
        this.logger.error({
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
