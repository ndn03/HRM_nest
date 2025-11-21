import { Injectable, Logger } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';

/**
 * RedisHealthIndicator
 * Class này dùng để kiểm tra tình trạng kết nối Redis (dành cho health check endpoint).
 * Kế thừa từ HealthIndicator của @nestjs/terminus.
 */
@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private readonly redisClient: Redis;
  // Logger dùng để ghi log ra console
  private readonly logger = new Logger(RedisHealthIndicator.name);

  constructor() {
    super();

    // Cấu hình Redis client
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10),
      connectTimeout: 10000, // Giới hạn thời gian kết nối (ms)
      lazyConnect: true, // Không tự động kết nối khi khởi tạo, chỉ kết nối khi có request
      maxRetriesPerRequest: 3, // Số lần thử lại tối đa cho mỗi request Redis
    });

    // Lắng nghe sự kiện khi kết nối Redis thành công
    this.redisClient.on('connect', () => {
      this.logger.log('✅ Redis health check client connected');
    });

    // Lắng nghe sự kiện khi có lỗi xảy ra trong Redis client
    this.redisClient.on('error', (err) => {
      this.logger.error('❌ Redis health check client error:', err.message);
    });
  }

  /**
   * 🧠 Hàm kiểm tra tình trạng của Redis bằng cách gửi lệnh `PING`
   * Nếu Redis trả về "PONG" → hoạt động bình thường.
   * @param key - Tên định danh của health check (ví dụ: 'redis')
   * @returns HealthIndicatorResult - Kết quả kiểm tra (healthy hoặc unhealthy)
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Ghi lại thời điểm bắt đầu để đo thời gian phản hồi (latency)
      const start = Date.now();

      // Gửi lệnh "PING" tới Redis để kiểm tra phản hồi
      const pong = await this.redisClient.ping();

      // Tính toán thời gian phản hồi (ms)
      const duration = Date.now() - start;

      // Nếu Redis phản hồi là "PONG" => hoạt động bình thường
      if (pong === 'PONG') {
        // Ghi log mức debug (chi tiết)
        this.logger.debug(`Redis ping successful in ${duration}ms`);

        // Trả về trạng thái "healthy" cho Terminus
        return this.getStatus(key, true, {
          duration: `${duration}ms`, // Thời gian phản hồi
          host: process.env.REDIS_HOST, // Host Redis đang kiểm tra
          port: process.env.REDIS_PORT, // Port Redis đang kiểm tra
        });
      }

      // Nếu phản hồi không phải "PONG", coi là lỗi
      return this.getStatus(key, false, {
        message: 'Redis ping failed', // Thông báo lỗi
        response: pong, // Phản hồi thực tế từ Redis
      });
    } catch (error) {
      // ❌ Nếu có lỗi (timeout, không kết nối được, ...), log lỗi và báo unhealthy
      this.logger.error('Redis health check failed:', error.message);

      // Trả về trạng thái unhealthy cho Terminus
      return this.getStatus(key, false, {
        message: error.message, // Nội dung lỗi
        host: process.env.REDIS_HOST, // Host đang kiểm tra
        port: process.env.REDIS_PORT, // Port đang kiểm tra
      });
    }
  }
  onApplicationShutdown() {
    this.redisClient.disconnect(); // Ngắt kết nối Redis
  }
}
