/**
 * Các hằng số cấu hình JWT.
 * Đối tượng này chứa các giá trị cấu hình liên quan đến JSON Web Token (JWT)
 * được sử dụng trong hệ thống xác thực người dùng.
 */
export const jwtConstants = {
  /**
   * Secret key dùng để ký JWT.
   * Key này phải được bảo mật tuyệt đối và không nên đưa trực tiếp vào source code.
   * Secret sẽ được dùng để xác minh tính hợp lệ của token khi giải mã.
   */
  secret: 'secretKey',

  /**
   * Thời gian hết hạn của JWT.
   * Quy định token sẽ tồn tại trong bao lâu trước khi bị hết hạn.
   * Ở đây sử dụng biến môi trường `JWT_EXPIRES_IN`, ví dụ: '7d', '1h', '30m', ...
   */
  expiredTime: process.env.JWT_EXPIRES_IN,
};
