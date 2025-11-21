import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { StoreConfig } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const cacheConfigOptions: CacheModuleAsyncOptions<StoreConfig> = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        connectTimeout: 15000, // 15 seconds timeout
      },
      ttl: 30 * 1000,
    });
    return { store };
  },
};

// Cache keys ...
