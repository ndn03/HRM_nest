import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { PasswordService } from '@common/services/password.service';
import { RoleModule } from '../role/role.module';
import { UserCommand } from '@commands/user.command';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  controllers: [UserController],
  providers: [UserService, PasswordService, UserCommand],
  exports: [UserService],
})
export class UserModule {}
