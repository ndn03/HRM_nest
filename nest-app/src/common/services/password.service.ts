import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

/**
 * PasswordService chịu trách nhiệm xử lý:
 * - Mã hoá (hash) mật khẩu người dùng
 * - So sánh mật khẩu khi đăng nhập
 * - Sinh token ngẫu nhiên (ví dụ: dùng trong quên mật khẩu, xác thực, v.v.)
 */
@Injectable()
export class PasswordService {
  /**
   * Hàm mã hoá mật khẩu (hash password)
   * @param password - Mật khẩu người dùng (dạng plain text - chưa mã hoá)
   * @returns {string} - Mật khẩu đã được mã hoá bằng bcrypt
   *
   * Giải thích:
   * - bcrypt là thư viện mã hoá mật khẩu phổ biến, an toàn, có tính “salt” để chống rainbow attack.
   * - Tham số `10` là số vòng salt (salt rounds), càng cao thì càng bảo mật nhưng xử lý chậm hơn.
   */
  hashingPassword = (password: string): string => bcrypt.hashSync(password, 10);

  /**
   * Hàm so sánh mật khẩu khi đăng nhập
   * @param plainText - Mật khẩu người dùng nhập vào (plain text)
   * @param hash - Mật khẩu đã mã hoá lưu trong database
   * @returns {boolean} - Trả về `true` nếu khớp, `false` nếu sai
   *
   * Giải thích:
   * - bcrypt sẽ tự động hash lại mật khẩu nhập vào và so sánh với hash lưu sẵn.
   * - Dùng để xác thực người dùng khi đăng nhập.
   */
  comparePassword = (plainText: string, hash: string): boolean =>
    bcrypt.compareSync(plainText, hash);

  /**
   * Hàm sinh token ngẫu nhiên
   * @returns {string} - Chuỗi UUID v4 ngẫu nhiên
   *
   * Giải thích:
   * - uuidV4 tạo ra một chuỗi duy nhất (unique ID) theo chuẩn UUID v4.
   * - Có thể dùng cho các tính năng như:
   *   + Link đặt lại mật khẩu (password reset)
   *   + Token xác thực tạm thời
   *   + Mã phiên giao dịch (session ID)
   */
  generateRandomToken = (): string => uuidV4().toString();
}
