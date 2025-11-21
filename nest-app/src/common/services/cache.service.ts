import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Milliseconds } from 'cache-manager';

/**
 * CacheService
 * Service này cung cấp các phương thức thao tác với bộ nhớ đệm (cache),
 * bao gồm tạo key cache, lấy – lưu – xóa – dọn toàn bộ cache.
 * Giúp tăng tốc độ phản hồi và giảm tải cho database hoặc API.
 */
@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Hàm tạo ra cache key duy nhất từ danh sách các thành phần đầu vào.
   * Dùng để đảm bảo mỗi tổ hợp tham số khác nhau sẽ tạo ra 1 cache key khác nhau.
   *
   * @param cacheKey - Mảng chứa các giá trị (tham số, object, id, ...) để sinh cache key
   * @returns {string} - Trả về key dạng chuỗi, ví dụ: "user&123" hoặc "product&{...}"
   */
  generateCacheKey(cacheKey: any[]): string {
    // Duyệt qua từng phần tử trong mảng cacheKey
    const key = cacheKey
      .map((k) => {
        // Nếu là object => chuyển thành chuỗi JSON
        if (typeof k === 'object' && k !== null) {
          return JSON.stringify(k);
        }
        // Nếu không phải object => ép kiểu sang chuỗi
        return String(k);
      })
      // Nối các phần tử lại bằng ký tự "&"
      .join('&');
    return key;
  }

  /**
   * Hàm lấy dữ liệu từ cache dựa vào cache key đã cho.
   *
   * @param cacheKey - Mảng tham số dùng để tạo cache key duy nhất
   * @returns {Promise<{ key: string; cache: T }>} - Trả về object gồm key và dữ liệu được cache (nếu có)
   */
  async get<T>(cacheKey: any[]): Promise<{ key: string; cache: T }> {
    // Sinh cache key từ danh sách tham số
    const key = this.generateCacheKey(cacheKey);

    // Lấy dữ liệu tương ứng với key từ cache
    const cache = await this.cacheManager.get<T>(key);

    // Trả về key và dữ liệu cache (nếu null thì cache miss)
    return { key, cache };
  }

  /**
   * Hàm lưu (hoặc cập nhật) dữ liệu vào cache với thời gian sống (TTL = Time To Live).
   *
   * @param cacheKey - Mảng tham số để sinh ra cache key duy nhất
   * @param data - Dữ liệu cần lưu vào cache
   * @param ttl - (Tuỳ chọn) thời gian tồn tại của cache (tính bằng milliseconds)
   * @returns {Promise<void>} - Không trả về giá trị, chỉ thực hiện lưu cache
   */
  set(cacheKey: any[], data: any, ttl?: Milliseconds): void {
    const key = this.generateCacheKey(cacheKey);
    // Lưu dữ liệu vào cache với key, giá trị và TTL (nếu có)
    this.cacheManager.set(key, data, ttl);
  }

  /**
   * Hàm xoá cache dựa theo prefix key (phần đầu của key)
   * Dùng trong trường hợp bạn muốn xoá một nhóm cache liên quan đến nhau,
   * ví dụ: xoá toàn bộ cache có prefix "products" sau khi cập nhật sản phẩm.
   *
   * @param cacheKeys - Mảng các mảng con, mỗi mảng con là một prefix cache key cần xoá
   * @returns {Promise<void>} - Promise báo hiệu quá trình xoá hoàn tất
   */
  async cleanBy(cacheKeys: any[][]): Promise<void> {
    // Lấy tất cả key hiện có trong cache store
    const keys = await this.cacheManager.store.keys();

    if (keys) {
      // Lọc ra các key cần xoá nếu chúng chứa prefix nằm trong cacheKeys
      const listKeysToRemove = keys.filter((key) =>
        cacheKeys.some((cacheKey) =>
          key.includes(this.generateCacheKey(cacheKey)),
        ),
      );

      // Nếu có key cần xoá → tiến hành xoá đồng thời
      if (listKeysToRemove?.length > 0)
        await Promise.all(
          listKeysToRemove.map((key) => this.cacheManager.del(key)),
        );
    }
  }

  /**
   * Hàm xoá toàn bộ cache trong hệ thống.
   * Cẩn thận khi dùng trong môi trường production vì sẽ xoá toàn bộ dữ liệu cache.
   *
   * @returns {Promise<void>} - Promise báo hiệu cache đã được dọn sạch
   */
  async cleanAll(): Promise<void> {
    await this.cacheManager.reset();
  }
}
