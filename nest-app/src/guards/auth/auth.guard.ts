import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ACCESS } from '@configs/role.config';
import { User } from '@entities/user.entity';

/**
 * Guard xác thực và phân quyền người dùng.
 *
 * Kế thừa từ `AuthGuard('jwt')` của Passport để:
 *  - Xác thực token JWT (tự động trích xuất và verify).
 *  - Sau đó kiểm tra quyền truy cập (permissions) dựa trên metadata của route.
 */
@Injectable()
export class AuthGuard extends AuthGuardPassport('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Hàm `canActivate` quyết định xem request hiện tại có được phép truy cập route hay không.
   *
   * Quy trình gồm 3 bước:
   * 1. Xác thực JWT token (nếu thất bại -> UnauthorizedException).
   * 2. Kiểm tra trạng thái tài khoản và role của user.
   * 3. Nếu route có yêu cầu quyền cụ thể, kiểm tra user có quyền đó không.
   *
   * @param context - Chứa thông tin về request hiện tại.
   * @returns Promise<boolean> - Trả về true nếu user hợp lệ và có quyền, ngược lại ném lỗi.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Kiểm tra xem route có được đánh dấu là public không
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu là public route, skip authentication
    if (isPublic) {
      return true;
    }

    // Chạy Passport JWT Guard trước để xác thực token và gắn `request.user`
    await Promise.resolve(super.canActivate(context));

    // Lấy danh sách quyền (permissions) mà route yêu cầu (nếu có)
    const permissions = this.reflector.get<ACCESS[]>(
      'permission',
      context.getHandler(),
    );

    //Lấy đối tượng request và user sau khi Passport xử lý
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // Nếu không có user => token không hợp lệ hoặc chưa đăng nhập
    if (!user) {
      throw new UnauthorizedException({
        message: 'Người dùng chưa được xác thực.',
      });
    }

    // Nếu tài khoản bị khóa hoặc không hoạt động
    if (!user.is_active) {
      throw new ForbiddenException({
        message: 'Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa.',
      });
    }

    // Nếu user không có role nào => không thể xác định quyền
    const { roles } = user;
    if (!roles || roles.length === 0) {
      throw new ForbiddenException({
        message: 'Người dùng chưa được gán bất kỳ vai trò (role) nào.',
      });
    }

    // Nếu route không yêu cầu quyền cụ thể (chỉ cần xác thực JWT) thì cho phép luôn
    if (!permissions || permissions.length === 0) return true;

    // Lấy toàn bộ quyền hiện tại từ danh sách role của user
    const permissionsCurrent = roles.flatMap((r) => r.permissions || []);

    // Kiểm tra xem có quyền nào khớp với quyền mà route yêu cầu không
    const isValid = permissionsCurrent.some((p) => permissions.includes(p));

    // Nếu không có quyền phù hợp => từ chối truy cập
    if (!isValid) {
      throw new ForbiddenException({
        message: 'Người dùng không có quyền truy cập chức năng này.',
      });
    }

    // Tất cả điều kiện hợp lệ => cho phép truy cập
    return true;
  }
}
