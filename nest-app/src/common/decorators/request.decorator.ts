import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator tùy chỉnh để lấy một tham số cụ thể từ object request
 * @param {string} key - Tên của tham số muốn lấy từ request
 * @param {ExecutionContext} ctx - Context thực thi chứa request
 * @returns {any} - Trả về giá trị của tham số trong request
 *
 * Logic:
 * 1. Sử dụng ExecutionContext để lấy object request HTTP.
 * 2. Truy xuất tham số dựa trên key được truyền vào.
 * 3. Trả về giá trị của tham số đó.
 */
export const RequestParam = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req[key]; // Trả về giá trị của tham số dựa trên key
  },
);
