import { registerAs } from '@nestjs/config';

/**
 * Cấu hình cơ bản (base) cho toàn bộ ứng dụng.
 * File này chứa các thiết lập quan trọng như:
 * - Cổng server chạy (port)
 * - Tiền tố API (API prefix)
 *
 * Đây là một phần của hệ thống ConfigModule của NestJS,
 * dùng để tách biệt cấu hình theo từng nhóm (namespace).
 */
export default registerAs('base', () => ({
  /**
   * Port mà ứng dụng sẽ chạy.
   * Ưu tiên lấy từ biến môi trường PORT.
   * Nếu không có, mặc định sẽ dùng port 3000.
   *
   * `parseInt(process.env.PORT, 10)`:
   *   → chuyển giá trị PORT từ string → number
   *   → `10` là base (hệ thập phân)
   */
  port: parseInt(process.env.PORT, 10) || 3000,

  /**
   * Tiền tố (prefix) chung cho toàn bộ API.
   * Mọi route trong ứng dụng sẽ nằm dưới đường dẫn:
   *    http://localhost:3000/api/...
   *
   * Việc đặt prefix giúp tổ chức route rõ ràng
   * và dễ quản lý khi phân chia module.
   */
  prefix: '/api',
}));
