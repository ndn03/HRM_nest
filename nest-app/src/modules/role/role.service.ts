import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@entities/role.entity';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { validateDto } from '@common/utils/validation.utils';
import { QueryRoleDto } from './dto/query-role.dto';
import { EOrder, EOrderBy } from '@src/common/type.common';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   *
   * Create a new role
   * @param {CreateRoleDto} body - The body of the role to create
   * @returns {Promise<Role>} - The created role
   */
  async create(body: CreateRoleDto): Promise<Role> {
    body = await validateDto(body, CreateRoleDto);

    const roleExits = await this.findOne({ code: body.code });
    if (roleExits) throw new BadRequestException('general.alreadyExists');

    const role = new Role();
    role.code = body.code;
    role.description = body.description;
    role.permissions = body.permissions;

    return this.roleRepository.save(role);
  }

  /**
   *
   * Find all roles with pagination, filtering, and sorting
   * @param {QueryRoleDto} query - The query parameters for filtering, sorting, and pagination
   * @returns {Promise<{ data: Role[]; total: number }>} - A list of roles and the total count
   */
  async findAll(query: QueryRoleDto): Promise<{ data: Role[]; total: number }> {
    query = await validateDto(query, QueryRoleDto);
    const {
      page = 1,
      limit = 10,
      order = EOrder.DESC,
      orderBy = EOrderBy.ID,
      s,
    } = query;
    const inIds = query?.['inIds[]'] || [];
    const notInIds = query?.['notInIds[]'] || [];

    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (s) queryBuilder.andWhere('role.code LIKE :s', { s: `%${s}%` });
    if (inIds.length)
      queryBuilder.andWhere('role.id IN (:...inIds)', { inIds });
    if (notInIds.length)
      queryBuilder.andWhere('role.id NOT IN (:...notInIds)', { notInIds });
    queryBuilder.orderBy(`role.${orderBy}`, order);
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  /**
   *
   * Find a role by specific properties
   * @param {FindOptionsWhere<Role> | FindOptionsWhere<Role>[]} property - The search conditions for finding the role
   * @returns {Promise<Role>} - The found role
   */
  async findOne(
    property: FindOptionsWhere<Role> | FindOptionsWhere<Role>[],
  ): Promise<Role> {
    return this.roleRepository.findOneBy({ ...property });
  }

  /**
   *
   * @param ids
   * @returns
   */
  async findAllInIds(ids: number[]) {
    return this.roleRepository.findBy({ id: In(ids) });
  }

  /**
   *
   * Update an existing role
   * @param id - The ID of the role to update
   * @param body - The updated role data
   * @returns {Promise<boolean>} - A boolean indicating if the update was successful
   */
  async update(id: number, body: UpdateRoleDto): Promise<boolean> {
    body = await validateDto(body, UpdateRoleDto);

    const roleExits = await this.findOne({ code: body.code, id: Not(id) });
    if (roleExits) throw new BadRequestException('general.alreadyExists');

    const result = await this.roleRepository.update(id, { ...body });
    return !!result.affected;
  }

  /**
   * Remove a role by its ID
   * @param id - The ID of the role to delete
   * @returns {Promise<boolean>} - A boolean indicating if the deletion was successful
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.roleRepository.delete(id);
    return !!result.affected;
  }
}
