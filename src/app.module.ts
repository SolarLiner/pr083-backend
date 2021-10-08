import {
  Injectable,
  Logger as NestLogger,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Logger as ITypeOrmLogger, QueryRunner } from 'typeorm';
import { AccessLogInterceptor } from './access-log.interceptor';
import { ApiModule } from './api/api.module';
import { PackageJson } from './package-json';

function removeCircularReferences(obj: any): any {
  function union<T>(a: Iterable<T>, b: Iterable<T>): Set<T> {
    return new Set([...a, ...b]);
  }
  function rcrInner(obj: any, references: Set<any>): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, value]) => !references.has(value))
        .map(([key, value]) => [
          key,
          rcrInner(value, union(references, [obj])),
        ]),
    );
  }
  return rcrInner(obj, new Set());
}

@Injectable()
class TypeOrmLogger implements ITypeOrmLogger {
  private readonly logger = new NestLogger(TypeOrmLogger.name);

  log(level: 'log' | 'info' | 'warn', message: any): any {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.log(message, removeCircularReferences({ message }));
        return;
      case 'warn':
        this.logger.warn(message, removeCircularReferences({ message }));
    }
  }

  logMigration(message: string): any {
    this.logEvent('migration', message, {});
    this.logger.debug(
      message,
      { event: 'migration', message },
      `${TypeOrmLogger.name}:migration`,
    );
  }

  logQuery(query: string, parameters?: any[]): any {
    this.logEvent('query', query, { query, parameters }, 'debug');
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]): any {
    if (error instanceof Error) {
      this.logger.error(
        error.message,
        error.stack,
        removeCircularReferences({
          error,
          query,
          parameters,
        }),
      );
    } else {
      this.logger.error(
        error,
        removeCircularReferences({ error, query, parameters }),
      );
    }
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logEvent(
      'slowQuery',
      `Slow query (${time} ms): ${query}`,
      { time, query, parameters, queryRunner },
      'warn',
    );
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.logEvent('schemaBuild', message, { queryRunner }, 'verbose');
  }

  private logEvent(
    event: string,
    message: string,
    rawParams: Record<string, any>,
    mode: 'warn' | 'log' | 'debug' | 'verbose' = 'debug',
  ) {
    const params = { ...removeCircularReferences(rawParams), event };
    const ctx = `${TypeOrmLogger.name}:${event}`;
    const logger = new NestLogger(ctx);
    switch (mode) {
      case 'log':
        return logger.log(message, params);
      case 'debug':
        return logger.debug(message, params);
      case 'verbose':
        return logger.verbose(message, params);
      case 'warn':
        return logger.warn(message, params);
    }
  }
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        logging: ['query', 'error'],
        logger: new TypeOrmLogger(),
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
        '.env.local',
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`,
      ],
    }),
    ApiModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AccessLogInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: PackageJson,
      useFactory: () =>
        import('../package.json').then(plainToClass.bind(null, PackageJson)),
    },
  ],
})
export class AppModule {}
