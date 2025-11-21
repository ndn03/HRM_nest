import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

// Định nghĩa các toán tử so sánh được hỗ trợ
type TComparison = 'eq' | 'gt' | 'gte' | 'in' | 'lt' | 'lte' | 'ne' | 'nin';

// eq: equal (bằng)
// gt: greater than (lớn hơn)
// gte: greater than or equal (lớn hơn hoặc bằng)
// in: trong mảng
// lt: less than (nhỏ hơn)
// lte: less than or equal (nhỏ hơn hoặc bằng)
// ne: not equal (không bằng)
// nin: not in (không trong mảng)

// Định nghĩa các kiểu dữ liệu được phép so sánh (key của T, number, Date, hoặc mảng)
type TSupportedTypes<T> = keyof T | number | Date | T[];

/**
 * So sánh giá trị của một thuộc tính với một giá trị khác hoặc một thuộc tính khác
 * @param valueOrProperty Giá trị để so sánh hoặc tên thuộc tính để lấy giá trị so sánh
 * @param operator Toán tử so sánh (eq, gt, lt, in, ...)
 * @param validationOptions Tuỳ chọn validate (ví dụ: tuỳ chỉnh message lỗi)
 */
export function Comparison<T>(
  valueOrProperty: TSupportedTypes<T>,
  operator: TComparison,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    // Đăng ký decorator với hệ thống validate
    registerDecorator({
      name: 'Comparison', // Tên decorator
      target: object.constructor, // Lớp chứa thuộc tính cần validate
      propertyName, // Tên thuộc tính cần validate
      constraints: [valueOrProperty, operator], // Tham số: giá trị/thuộc tính và toán tử
      options: validationOptions, // Tuỳ chọn validate

      /**
       * Thực hiện so sánh giữa giá trị thuộc tính và giá trị tham chiếu
       * @param value Giá trị của thuộc tính cần validate
       * @param args Context validate (bao gồm object và constraints)
       */
      validator: {
        validate(value: TSupportedTypes<T>, args: ValidationArguments) {
          // Lấy giá trị tham chiếu và toán tử
          const [propertyOrValue, op] = args.constraints as [
            TSupportedTypes<T>,
            TComparison,
          ];

          // Xác định giá trị tham chiếu (có thể là value trực tiếp hoặc thuộc tính khác)
          let relatedValue: number | Date | string | undefined;
          if (propertyOrValue instanceof Date) {
            relatedValue = propertyOrValue as Date; // Nếu là Date thì dùng trực tiếp
          } else if (typeof propertyOrValue === 'string') {
            // Nếu là tên thuộc tính, lấy giá trị từ object
            relatedValue = (args.object as object)[
              propertyOrValue as keyof typeof args.object
            ] as number | Date;
          } else {
            relatedValue = propertyOrValue as number; // Nếu là number thì dùng trực tiếp
          }

          // Nếu giá trị tham chiếu tồn tại
          if (relatedValue != null) {
            // Nếu giá trị tham chiếu là mảng, xử lý toán tử 'in' và 'nin'
            if (Array.isArray(relatedValue)) {
              switch (op) {
                case 'in':
                  return relatedValue.includes(value); // Kiểm tra value có trong mảng không
                case 'nin':
                  return !relatedValue.includes(value); // Kiểm tra value không trong mảng
                default:
                  throw new Error(`Toán tử không hợp lệ: ${op}`);
              }
            }

            // So sánh giá trị kiểu Date
            if (value instanceof Date && relatedValue instanceof Date) {
              switch (op) {
                case 'eq':
                  return value.getTime() === relatedValue.getTime();
                case 'gt':
                  return value.getTime() > relatedValue.getTime();
                case 'gte':
                  return value.getTime() >= relatedValue.getTime();
                case 'lt':
                  return value.getTime() < relatedValue.getTime();
                case 'lte':
                  return value.getTime() <= relatedValue.getTime();
                case 'ne':
                  return value.getTime() !== relatedValue.getTime();
                default:
                  throw new Error(`Toán tử không hợp lệ: ${op}`);
              }
            }

            // So sánh giá trị kiểu string
            if (
              (!(value instanceof Date) || !(relatedValue instanceof Date)) &&
              typeof value === 'string' &&
              typeof relatedValue === 'string'
            ) {
              switch (op) {
                case 'eq':
                  return value === relatedValue;
                case 'ne':
                  return value !== relatedValue;
                default:
                  throw new Error(`Toán tử không hợp lệ: ${op}`);
              }
            }

            // So sánh giá trị kiểu number
            if (typeof value === 'number' && typeof relatedValue === 'number') {
              switch (op) {
                case 'eq':
                  return value === relatedValue; // Bằng
                case 'gt':
                  return value > relatedValue; // Lớn hơn
                case 'gte':
                  return value >= relatedValue; // Lớn hơn hoặc bằng
                case 'lt':
                  return value < relatedValue; // Nhỏ hơn
                case 'lte':
                  return value <= relatedValue; // Nhỏ hơn hoặc bằng
                case 'ne':
                  return value !== relatedValue; // không bằng
                default:
                  throw new Error(`Invalid operator: ${op}`); // Toán tử không hợp lệ
              }
            }

            // Báo lỗi nếu so sánh giữa các kiểu dữ liệu không được hỗ trợ
            throw new Error(
              `Không hỗ trợ so sánh giữa ${typeof value} và ${typeof relatedValue}`,
            );
          }

          // Nếu giá trị tham chiếu null/undefined, mặc định trả về true
          return true;
        },

        /**
         * Message lỗi mặc định khi validate thất bại
         * @param args Context validate
         */
        defaultMessage(args: ValidationArguments) {
          const [propertyOrValue] = args.constraints;
          const target =
            propertyOrValue instanceof Date
              ? 'giá trị'
              : `thuộc tính ${propertyOrValue}`;
          return `${propertyName} phải thỏa mãn điều kiện "${operator}" với ${target}.`;
        },
      },
    });
  };
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator tùy chỉnh để lấy csrfToken từ request
export const CsrfToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.csrfToken(); // Trả về csrfToken từ request
  },
);
