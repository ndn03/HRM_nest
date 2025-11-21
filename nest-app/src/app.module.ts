import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configurationConfig from './configs/configuration.config';
import { cacheConfigOptions } from './configs/cache.config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { CacheService } from '@common/services/cache.service';
import { I18nModuleConfig } from '@src/languages/i18n.config';
import { TerminusModule } from '@nestjs/terminus';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { ExceptionFilter } from '@filters/exception/exception.filter';
// import { ResponseInterceptor } from '@interceptors/response/response.interceptor';
import { ExceptionI18nFilter } from '@filters/exception-i18n/exception-i18n.filter';
import { ResponseI18nInterceptor } from '@interceptors/response-i18n/response-i18n.interceptor';
import { AuthGuard } from '@guards/auth/auth.guard';
import { ConsoleModule } from 'nestjs-console';
import { HelloCommand } from '@commands/hello.command';
import { UserModule } from '@modules/user/user.module';
import { RoleModule } from '@modules/role/role.module';
import { AuthModule } from '@modules/auth/auth.module';
import { MediaModule } from '@modules/media/media.module';
import { MailModule } from '@modules/mail/mail.module';
import { RedisHealthIndicator } from './common/healths/redis-health.indicator';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [configurationConfig],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot({
      cronJobs: true,
      intervals: true,
      timeouts: true,
    }),
    CacheModule.registerAsync(cacheConfigOptions),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    I18nModuleConfig,
    TerminusModule,
    HttpModule,
    ConsoleModule,
    AuthModule,
    UserModule,
    RoleModule,
    MediaModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CacheService,
    RedisHealthIndicator,
    { provide: APP_INTERCEPTOR, useClass: ResponseI18nInterceptor },
    { provide: APP_FILTER, useClass: ExceptionI18nFilter },
    { provide: APP_GUARD, useClass: AuthGuard },
    HelloCommand,
  ],
})
export class AppModule {}
