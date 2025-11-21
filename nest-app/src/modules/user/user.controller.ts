import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  SetPasswordDto,
  UpdateMyProfileDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '@common/decorators/auth.decorator';
import { ACCESS } from '@configs/role.config';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from '@entities/user.entity';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.OK)
  @Auth(ACCESS.CREATE_USER)
  async create(@Body() body: CreateUserDto) {
    const data = this.userService.create(body);
    return { data, message: 'User has been created successfully.' };
  }

  @Get()
  @Auth(ACCESS.LIST_USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a list of users' })
  async findAll(@Query() query: QueryUserDto) {
    const { data, total } = await this.userService.findAll(query);
    return {
      message: 'User list retrieved successfully.',
      data,
      total,
      limit: +query.limit,
      page: +query.page,
    };
  }

  @Get(':id')
  @Auth(ACCESS.VIEW_USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get details of a specific user' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.findOne({ id: id });
    return { data, message: 'User details retrieved successfully.' };
  }

  @Patch(':id')
  @Auth(ACCESS.UPDATE_ROLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user information' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    const result = await this.userService.update(id, body);
    if (!result)
      throw new BadRequestException({ message: 'Failed to update user.' });
    return { message: 'User has been updated successfully.' };
  }

  @Patch(':id/set-password')
  @Auth(ACCESS.UPDATE_ROLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set a new password for a user' })
  async setPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SetPasswordDto,
  ) {
    const result = await this.userService.setPassword(id, body.newPassword);
    if (!result)
      throw new BadRequestException({ message: 'Failed to update password.' });
    return { message: 'Password has been updated successfully.' };
  }

  @Get('my-profile')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get the profile of the authenticated user' })
  async findOneMyProfile(@AuthUser() user: User) {
    delete user.password;
    return { data: user, message: 'User profile retrieved successfully.' };
  }

  @Patch('/my-profile')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update the profile of the authenticated user' })
  async updateMyProfile(
    @AuthUser() user: User,
    @Body() body: UpdateMyProfileDto,
  ) {
    const result = await this.userService.update(user.id, body);
    if (!result)
      throw new BadRequestException({ message: 'Failed to update profile.' });
    return { message: 'Profile has been updated successfully.' };
  }

  @Delete(':id/soft-delete')
  @Auth(ACCESS.SOFT_DELETE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a user' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.softDelete([id]);
    if (!result)
      throw new BadRequestException({ message: 'Failed to soft delete user.' });
    return { message: 'User has been soft deleted successfully.' };
  }

  @Patch(':id/restore')
  @Auth(ACCESS.RESTORE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted user' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.restore([id]);
    if (!result)
      throw new BadRequestException({ message: 'Failed to restore user.' });
    return { message: 'User has been restored successfully.' };
  }

  @Delete(':id')
  @Auth(ACCESS.DELETE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete a user' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.delete([id]);
    if (!result)
      throw new BadRequestException({ message: 'Failed to delete user.' });
    return { message: 'User has been permanently deleted successfully.' };
  }
}
