import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type * as express from 'express';

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AccessLogInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<express.Request>();

    const method = req.method;
    const url = req.originalUrl;

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const res = http.getResponse<express.Response>();
        const statusCode = res.statusCode;

        this.logger.log(`${method} ${url} ${statusCode} - ${duration} ms`);
      }),
    );
  }
}
