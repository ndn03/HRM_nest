import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { ApiOperation } from '@nestjs/swagger';
import { RedisHealthIndicator } from '@common/healths/redis-health.indicator';

dayjs.extend(utc);
dayjs.extend(timezone);

@Controller('v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @ApiOperation({
    summary: 'Returns the health status of the application.',
  })
  @Get('health/check-health')
  async checkHealth() {
    return {
      message: 'Successfully.',
      data: await this.appService.getHello(),
    };
  }

  @ApiOperation({
    summary: 'Performs an HTTP health check by pinging an external URL.',
  })
  @Get('health/http-health')
  @HealthCheck()
  getHello() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://www.google.com/'),
    ]);
  }

  @ApiOperation({ summary: 'Checks the health of the database connection.' })
  @Get('health/database-health')
  @HealthCheck()
  databaseHealth() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @ApiOperation({
    summary: 'Checks disk storage health based on threshold usage.',
  })
  @Get('health/disk-health')
  @HealthCheck()
  diskHealth() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
    ]);
  }

  @ApiOperation({
    summary: 'Checks the memory usage to ensure heap size is within limit.',
  })
  @Get('health/memory-health')
  @HealthCheck()
  memoryHealth() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @ApiOperation({ summary: 'Checks the health of the Redis connection.' })
  @Get('health/redis-health')
  @HealthCheck()
  redisHealth() {
    return this.health.check([() => this.redis.isHealthy('redis')]);
  }

  @ApiOperation({ summary: 'Tests the handling of HTTP exceptions.' })
  @Get('health/check-http-exception-filter')
  async checkHttpExceptionFilter() {
    throw new HttpException(
      { message: 'general.limitNumberConstraint' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({
    summary: 'Retrieves the system time settings including local and UTC time.',
  })
  @Get('system/check-time-system')
  async checkTimeSetting() {
    try {
      const userTimeZone = dayjs.tz.guess();
      const localTime = dayjs().tz(userTimeZone).format();
      const utcTime = dayjs().utc().format();

      return {
        // message: 'general.success',
        userTimeZone,
        localTime,
        utcTime,
        time: new Date(),
        node: process.env.NODE_ENV,
      };
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
