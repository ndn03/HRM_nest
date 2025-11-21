import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

// Load biến môi trường từ file .env
dotenv.config({ path: '.env' });

// Cấu hình TypeORM kết nối MySQL
export const typeOrmConfig: TypeOrmModuleOptions = {
  /**
   * Loại cơ sở dữ liệu sử dụng — ở đây là MySQL.
   * TypeORM hỗ trợ nhiều loại DB: MySQL, PostgreSQL, SQLite,...
   */
  type: 'mysql',

  /**
   * Địa chỉ host của MySQL.
   * Lấy từ biến môi trường MYSQL_HOST.
   */
  host: process.env.MYSQL_HOST,

  /**
   * Cổng MySQL — mặc định 3306.
   * Ép kiểu sang Number khi lấy từ biến môi trường.
   */
  port: Number(process.env.MYSQL_PORT),

  /**
   * Username để đăng nhập vào MySQL.
   * Lấy từ biến môi trường MYSQL_USERNAME.
   */
  username: process.env.MYSQL_USERNAME,

  /**
   * Password tương ứng với username.
   * Lấy từ biến môi trường MYSQL_PASSWORD.
   */
  password: process.env.MYSQL_PASSWORD,

  /**
   * Tên database sẽ kết nối.
   * Lấy từ MYSQL_DATABASE trong file .env.
   */
  database: process.env.MYSQL_DATABASE,

  /**
   * Tự động load toàn bộ entity trong ứng dụng.
   * Giúp TypeORM tự tìm file entity mà không cần khai báo thủ công.
   */
  autoLoadEntities: true,

  /**
   * Tự động đồng bộ cấu trúc bảng dựa trên entity.
   * CHÚ Ý: Chỉ bật trong development để tránh mất dữ liệu production.
   */
  synchronize: process.env.NODE_ENV === 'development',

  /**
   * Số lần thử kết nối lại khi xảy ra lỗi kết nối ban đầu.
   * Mặc định ở đây là 3 lần retry.
   */
  retryAttempts: 3,

  /**
   * Thiết lập timezone cho kết nối DB.
   * 'Z' = UTC (giờ quốc tế).
   */
  timezone: 'Z',

  /**
   * Bật/tắt log câu SQL.
   * false = không log.
   * Khi debug bạn có thể bật true.
   */
  logging: false,

  /**
   * Khai báo file chứa các entity đã build (JS).
   * Thường nằm trong thư mục dist sau khi build.
   */
  entities: ['dist/entities/*.entity.js'],

  /**
   * Khai báo file migration đã build.
   * Migration dùng để quản lý thay đổi schema theo thời gian.
   */
  migrations: ['dist/migrations/*.js'],

  /**
   * Tên bảng lưu lịch sử migration.
   * Mặc định TypeORM là "migrations".
   */
  migrationsTableName: 'migrations',
};

// Khởi tạo DataSource của TypeORM dựa trên cấu hình trên
export const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);
