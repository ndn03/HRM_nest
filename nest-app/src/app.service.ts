import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from './common/services/cache.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(CacheService) private readonly cacheService: CacheService,
  ) {}

  async getHello(): Promise<string> {
    const { cache, key } = await this.cacheService.get([
      'HELLO',
      { _v: '0.0.1' },
    ]);
    if (cache) return `${key}:  ${cache}`;
    this.cacheService.set(['HELLO', { _v: '0.0.1' }], 'Hello World!');
    return 'Hello World!';
  }
}
