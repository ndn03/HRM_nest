import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

/**
 * Decorator `@Auth()` — Dùng để:
 * - Thêm xác thực Bearer token (JWT) vào route (Swagger hiển thị cần token).
 * - Gán metadata `permission` để kiểm tra quyền hạn trong `AuthGuard`.
 * - Tự động thêm response 401 (Unauthorized) vào Swagger.
 *
 * @param {string[]} permission - Danh sách quyền (permission) yêu cầu cho route.
 * @returns {MethodDecorator & ClassDecorator} - Decorator áp dụng cho class hoặc method.
 *
 * Ví dụ sử dụng:
 * ```ts
 * @Auth('CREATE_USER', 'DELETE_USER')
 * @Get('/users')
 * findAll() { ... }
 * ```
 */
export const Auth = (
  ...permission: string[]
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    ApiBearerAuth(), // Thêm xác thực Bearer token vào Swagger (hiển thị icon )
    SetMetadata('permission', permission), // Gắn metadata "permission" để AuthGuard có thể kiểm tra quyền
    ApiUnauthorizedResponse({ description: 'Unauthorized' }), // Cấu hình Swagger: hiển thị response 401
  );
};

/**
 * Decorator `@AuthUser()` — Dùng để lấy thông tin người dùng hiện tại từ request.
 *
 * @param {string} data - Tên thuộc tính cụ thể của user muốn lấy (tùy chọn).
 * @param {ExecutionContext} ctx - Ngữ cảnh thực thi để lấy request hiện tại.
 * @returns {any} - Trả về toàn bộ đối tượng user hoặc chỉ một thuộc tính cụ thể.
 *
 * Giải thích:
 * - Khi người dùng đăng nhập thành công, thông tin user được Passport gắn vào `request.user`.
 * - Decorator này giúp truy cập nhanh dữ liệu đó trong controller.
 *
 * Ví dụ sử dụng:
 * ```ts
 * // Lấy toàn bộ user
 * @Get('profile')
 * getProfile(@AuthUser() user: User) {
 *   return user;
 * }
 *
 * // Lấy một thuộc tính cụ thể, ví dụ userId
 * @Get('id')
 * getUserId(@AuthUser('id') userId: number) {
 *   return userId;
 * }
 * ```
 */
export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // Lấy đối tượng request từ context
    const user = request.user; // Lấy thông tin user đã được Passport xác thực

    // Nếu có "data" (ví dụ 'id' hoặc 'username') thì trả về thuộc tính đó, ngược lại trả về toàn bộ user
    return data ? user && user[data] : user;
  },
);

/**
 * Public decorator để đánh dấu route không cần authentication
 * Sử dụng cho các endpoints như login, register, forgot-password, etc.
 *
 * @example
 * @Public()
 * @Post('login')
 * login() { ... }
 */
export const Public = () => SetMetadata('isPublic', true);
