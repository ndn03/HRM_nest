import * as path from 'path';
import { Module } from '@nestjs/common';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
} from 'nestjs-i18n';

/**
 * Module cấu hình hệ thống i18n (đa ngôn ngữ) cho ứng dụng NestJS
 *
 * 🔍 Giải thích logic:
 * - `nestjs-i18n` giúp ứng dụng hỗ trợ đa ngôn ngữ (multi-language).
 * - Mỗi request có thể chứa thông tin ngôn ngữ (qua query, header, cookie...),
 *   và hệ thống sẽ tự động chọn ngôn ngữ tương ứng để dịch nội dung.
 *
 * Cấu hình chi tiết:
 * 1. `fallbackLanguage`: Ngôn ngữ mặc định khi không xác định được ngôn ngữ từ request.
 * 2. `loaderOptions.path`: Đường dẫn đến thư mục chứa các file ngôn ngữ (vd: i18n/en.json, i18n/vn.json).
 * 3. `loaderOptions.watch`: Bật chế độ tự động reload khi file ngôn ngữ thay đổi (hữu ích khi dev).
 * 4. `resolvers`: Xác định thứ tự và cách lấy ngôn ngữ từ request:
 *    - `QueryResolver`: Lấy từ query string (vd: ?lang=vn)
 *    - `HeaderResolver`: Lấy từ header (vd: Accept-Language: en)
 *    - `CookieResolver`: Lấy từ cookie
 *    - `AcceptLanguageResolver`: Lấy theo ngôn ngữ mặc định của trình duyệt
 *
 * Thứ tự trong mảng `resolvers` sẽ quyết định độ ưu tiên khi xác định ngôn ngữ.
 */
@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'vn', // Ngôn ngữ mặc định (Vietnamese)
      loaderOptions: {
        path: path.join(__dirname, 'i18n/'), // Thư mục chứa các file ngôn ngữ
        watch: true, // Tự reload khi file ngôn ngữ thay đổi
      },
      resolvers: [
        new QueryResolver(['lang', 'vn']), // Ưu tiên lấy từ query string (?lang=vn)
        new HeaderResolver(['lang']), // Sau đó lấy từ header
        new CookieResolver(), // Tiếp theo lấy từ cookie
        { use: QueryResolver, options: ['lang'] }, // Cách viết khác cho QueryResolver
        AcceptLanguageResolver, // Cuối cùng lấy từ header Accept-Language của trình duyệt
      ],
    }),
  ],
})
export class I18nModuleConfig {}
