import * as crypto from 'crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@entities/user.entity';
import { UserService } from '@modules/user/user.service';
import { PasswordService } from '@common/services/password.service';
import { IResAuth, TPayloadJwt } from './auth.interface';
import { jwtConstants } from '@configs/auth.config';

/**
 * AuthService chịu trách nhiệm xử lý toàn bộ logic xác thực người dùng:
 *  - Kiểm tra thông tin đăng nhập hợp lệ
 *  - Sinh access token và refresh token
 *  - Đảm bảo tài khoản hoạt động bình thường trước khi cho phép đăng nhập
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly useService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   *  Xác thực thông tin người dùng trước khi đăng nhập.
   *
   * - Kiểm tra xem username có tồn tại trong cơ sở dữ liệu không.
   * - Kiểm tra trạng thái hoạt động của tài khoản (có bị khóa hay không).
   * - Kiểm tra xem mật khẩu nhập vào có khớp với mật khẩu được lưu trữ không.
   *
   * @param {string} username - Tên đăng nhập người dùng.
   * @param {string} password - Mật khẩu người dùng nhập vào.
   * @returns {Promise<User>} - Trả về thông tin người dùng nếu hợp lệ.
   * @throws {BadRequestException} - Nếu username không tồn tại hoặc mật khẩu không đúng.
   * @throws {ForbiddenException} - Nếu tài khoản bị khóa hoặc không hoạt động.
   */
  async validUserBeforeLogin(
    username: string,
    password: string,
  ): Promise<User> {
    // Tìm người dùng theo username trong cơ sở dữ liệu
    const user = await this.useService.findOne({ username }, true);

    // Không tồn tại người dùng
    if (!user)
      throw new BadRequestException('Thông tin đăng nhập không chính xác!');

    // Tài khoản đang bị khóa
    if (!user.is_active)
      throw new ForbiddenException('Tài khoản của bạn đang bị tạm khóa!');

    // So sánh mật khẩu nhập vào với mật khẩu đã được mã hóa trong DB
    const isCorrectPassword = this.passwordService.comparePassword(
      password,
      user.password,
    );

    // Mật khẩu không khớp
    if (!isCorrectPassword)
      throw new BadRequestException('Thông tin đăng nhập không chính xác!');

    // Tất cả hợp lệ, trả về thông tin người dùng
    return user;
  }

  /**
   *  Tạo cặp access token và refresh token cho người dùng hợp lệ.
   *
   * - `access token`: Dùng để xác thực các API, có thời gian sống ngắn.
   * - `refresh token`: Dùng để cấp lại access token mới khi hết hạn, có thời gian dài hơn.
   *
   * Refresh token được thêm vào một `hash` dựa trên mật khẩu hiện tại,
   * giúp vô hiệu hóa token cũ nếu người dùng thay đổi mật khẩu.
   *
   * @param {User} user - Đối tượng người dùng cần tạo token.
   * @returns {IResAuth} - Gồm accessToken và refreshToken.
   */
  createToken(user: User): IResAuth {
    // Payload cơ bản chứa thông tin định danh của người dùng
    const payload: TPayloadJwt = {
      id: user.id,
      username: user.username,
    };

    // Tạo refreshPayload có thêm hash dựa trên mật khẩu của người dùng
    // Điều này giúp refresh token tự động vô hiệu nếu mật khẩu bị thay đổi
    const refreshPayload = {
      ...payload,
      hash: crypto.createHash('md5').update(user.password).digest('hex'),
    };

    // Trả về hai loại token
    return {
      // Token truy cập ngắn hạn
      accessToken: this.jwtService.sign(payload),

      // Token làm mới, có thời gian sống dài hơn (90 ngày)
      refreshToken: this.jwtService.sign(refreshPayload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '90d',
        secret: jwtConstants.secret,
      }),
    };
  }
}
