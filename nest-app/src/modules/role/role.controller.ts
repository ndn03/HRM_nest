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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@common/decorators/auth.decorator';
import { ACCESS, PERMISSIONS } from '@configs/role.config';
import { QueryRoleDto } from './dto/query-role.dto';

@ApiTags('Role')
@Controller('v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Auth(ACCESS.CREATE_ROLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.roleService.create(createRoleDto);
    return { message: 'general.success', data };
  }

  @Get()
  @Auth(ACCESS.LIST_ROLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a list of roles' })
  async findAll(@Query() query: QueryRoleDto) {
    const { data, total } = await this.roleService.findAll(query);
    return {
      message: 'general.success',
      data,
      total,
      limit: +query.limit,
      page: +query.page,
    };
  }

  @Get('permission')
  @Auth(ACCESS.LIST_PERMISSION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a list of available permissions' })
  findAllPermission() {
    return {
      message: 'general.success',
      data: PERMISSIONS,
    };
  }

  @Patch(':id')
  @Auth(ACCESS.UPDATE_ROLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a role' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRoleDto,
  ) {
    const result = await this.roleService.update(id, body);
    if (!result) throw new BadRequestException({ message: 'general.failed' });
    return { message: 'general.success' };
  }

  @Delete(':id')
  @Auth(ACCESS.DELETE_ROLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a role' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.roleService.remove(id);
    if (!result) throw new BadRequestException({ message: 'general.failed' });
    return { message: 'general.success' };
  }
}
