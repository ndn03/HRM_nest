import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@entities/role.entity';
import { Repository } from 'typeorm';
import { ACCESS, ERole } from '@configs/role.config';

@Injectable()
export class RoleSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Hàm tự động chạy khi ứng dụng khởi động (theo lifecycle hook của NestJS)
   * => Dùng để đồng bộ (tạo hoặc cập nhật) các role mặc định trong hệ thống
   */
  async onApplicationBootstrap() {
    // Đồng bộ Role ADMINISTRATOR (quản trị viên)
    await this.syncAdminRole();

    // Đồng bộ Role GUEST (khách)
    await this.syncGuestRole();
  }

  /**
   * Hàm xử lý đồng bộ role ADMINISTRATOR
   * - Nếu chưa có: tạo mới với toàn bộ quyền (full permissions)
   * - Nếu đã có: kiểm tra xem có thiếu quyền nào không, nếu thiếu thì cập nhật
   */
  private async syncAdminRole() {
    // Tìm role ADMINISTRATOR trong DB
    const adminRole = await this.roleRepository.findOneBy({
      code: ERole.ADMINISTRATOR,
    });

    // Lấy danh sách tất cả quyền có trong hệ thống
    const allPermissions = Object.values(ACCESS);

    // Nếu chưa tồn tại role ADMINISTRATOR → tạo mới
    if (!adminRole) {
      const role = await this.roleRepository.save({
        code: 'ADMINISTRATOR',
        description: 'Administrator role with full permissions', // Mô tả: có toàn quyền
        permissions: allPermissions,
      });
      Logger.debug(
        '🚀 ~ ADMINISTRATOR role created with full permissions:',
        role,
      );
    } else {
      // Kiểm tra xem role này có thiếu quyền nào không
      const hasMissingPermissions = allPermissions.some(
        (perm) => !adminRole.permissions.includes(perm),
      );

      // Nếu thiếu quyền hoặc số lượng quyền không khớp → cập nhật lại đầy đủ
      if (
        hasMissingPermissions ||
        adminRole.permissions.length !== allPermissions.length
      ) {
        adminRole.permissions = allPermissions;
        await this.roleRepository.save(adminRole);
        console.log('🚀 ~ ADMINISTRATOR role updated with full permissions');
      }
    }
  }

  /**
   * Hàm xử lý đồng bộ role GUEST (người dùng chưa đăng nhập)
   * - Nếu chưa có → tạo mới với quyền rỗng (không có quyền nào)
   */
  private async syncGuestRole() {
    // Tìm role GUEST trong DB
    const guestRole = await this.roleRepository.findOneBy({ code: 'GUEST' });

    // Nếu chưa tồn tại → tạo mới
    if (!guestRole) {
      const role = await this.roleRepository.save({
        code: 'GUEST',
        description: 'Guest role with limited permissions', // Mô tả: quyền hạn giới hạn
        permissions: [],
      });
      Logger.debug('🚀 ~ ADMINISTRATOR role created:', role);
    }
  }
}
