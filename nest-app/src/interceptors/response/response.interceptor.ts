import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor này được dùng để định dạng lại response (phản hồi)
 * gửi về client theo cấu trúc thống nhất.
 *
 * @Injectable() cho phép class này được inject vào controller hoặc module khác.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * Hàm `intercept` được gọi mỗi khi có response chuẩn bị được gửi từ controller.
   *
   * @param context - Chứa thông tin về request/response hiện tại (ExecutionContext).
   * @param next - Cho phép tiếp tục luồng xử lý request và nhận lại dữ liệu response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // `next.handle()` trả về một Observable đại diện cho dữ liệu mà controller trả về.
    // Ta có thể dùng `.pipe()` để thao tác (map, filter,...) dữ liệu trước khi trả về client.
    return next.handle().pipe(
      map((data) => {
        // Lấy đối tượng response từ context HTTP (chỉ có trong context HTTP, không áp dụng cho WS, RPC)
        const response = context.switchToHttp().getResponse();

        // Trả về một object chuẩn hóa cấu trúc phản hồi
        return {
          // Mã trạng thái HTTP (ví dụ: 200, 201, 400, 500,...)
          statusCode: response.statusCode,
          // Thông điệp mô tả (nếu có) — có thể do controller trả về hoặc middleware thêm vào
          message: data?.message ?? 'Success',
          // Trường `data`: phần dữ liệu thực tế trả về cho client (loại bỏ message nếu cần)
          data: data?.data ?? data,

          // Có thể thêm timestamp để theo dõi thời gian phản hồi
          timestamp: new Date().toISOString(),
          // Có thể thêm đường dẫn API đang được gọi (hữu ích cho debug/logging)
          path: context.switchToHttp().getRequest().url,
        };
      }),
    );
  }
}
