import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { validateDto } from '@common/utils/validation.utils';
import { PasswordService } from '@common/services/password.service';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { RoleService } from '../role/role.service';
import { ERole } from '@configs/role.config';
import { QueryUserDto } from './dto/query-user.dto';
import { EOrder, EOrderBy } from '@src/common/type.common';
import { Role } from '@entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   *
   * Creates a new user with the provided details and assigned roles.
   * @param {CreateUserDto}body - The body of the request containing user details such as email, password, and role IDs.
   * @returns {Promise<User>} - Returns a promise with the newly created user.
   * @throws {BadRequestException} - Throws an exception if the email already exists or if any role ID is invalid.
   */
  async create(body: CreateUserDto): Promise<User> {
    body = await validateDto(body, CreateUserDto);
    const { username, email, password, roleIds, isActive } = body;
    const existingUser = await this.userRepository.findOne({
      where: { username, email },
    });
    if (existingUser) throw new BadRequestException('general.alreadyExists');
    const roles = await this.roleService.findAllInIds(roleIds);
    if (roles.length !== roleIds.length)
      throw new BadRequestException('general.failed');
    const user = new User(this.passwordService);
    user.username = username;
    user.email = email;
    user.password = password;
    user.roles = roles;
    user.is_active = !!isActive;

    return this.userRepository.save(user);
  }

  /**
   * Handles the registration of a new user.
   * @param body - The registration data for the user.
   * @returns The newly created user saved to the database.
   * @throws BadRequestException - If the email already exists.
   * @throws HttpException - If the default role cannot be found.
   */
  async register(body: RegisterDto): Promise<User> {
    body = await validateDto(body, RegisterDto);
    const { username, email, password } = body;

    const existingUser = await this.userRepository.findOne({
      where: { username, email },
    });
    if (existingUser) throw new BadRequestException('general.alreadyExists');

    const guestRole = await this.roleService.findOne({ code: ERole.GUEST });
    if (!guestRole)
      throw new HttpException(
        'general.failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const user = new User(this.passwordService);
    user.username = username;
    user.email = email;
    user.password = password;
    user.roles = [guestRole];

    return this.userRepository.save(user);
  }

  /**
   *
   * Fetches a list of users based on query parameters.
   * @param {QueryUserDto} query - The query parameters for filtering users.
   * @returns {Promise<{ data: User[]; total: number }>} - The list of users and the total count.
   */
  async findAll(query: QueryUserDto): Promise<{ data: User[]; total: number }> {
    query = await validateDto(query, QueryUserDto);
    const {
      page = 1,
      limit = 10,
      order = EOrder.DESC,
      orderBy = EOrderBy.ID,
      s,
      isDeleted,
      withDeleted,
    } = query;
    const inIds = query?.['inIds[]'] || [];
    const notInIds = query?.['notInIds[]'] || [];

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles');

    if (s) queryBuilder.andWhere('user.email LIKE :s', { s: `%${s}%` });
    if (inIds.length)
      queryBuilder.andWhere('user.id IN (:...inIds)', { inIds });
    if (notInIds.length)
      queryBuilder.andWhere('user.id NOT IN (:...notInIds)', { notInIds });
    if (isDeleted != null) {
      if (!!isDeleted) {
        queryBuilder.andWhere('user.deletedAt IS NOT NULL');
      } else {
        queryBuilder.andWhere('user.deletedAt IS NULL');
      }
    }
    if (withDeleted) queryBuilder.withDeleted();
    queryBuilder.addOrderBy(`user.${orderBy}`, order);
    queryBuilder.skip((+page - 1) * +limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  /**
   *
   * Finds a user by specific properties and returns the user along with their associated roles.
   * Optionally includes hidden fields if `includeHiddenFields` is set to `true`.
   * @param {FindOptionsWhere<User> | FindOptionsWhere<User>[]} property - The properties or list of properties to search for the user. Can pass a single search object or an array of search objects.
   * @param {boolean} [includeHiddenFields=false] - Whether to include hidden fields that are marked as `select: false` in the entity.
   * @returns {Promise<User>} - Returns the user object along with their roles. If no user is found, it returns null.
   */
  async findOne(
    property: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    includeHiddenFields: boolean = false,
  ): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where({ ...property });
    if (includeHiddenFields) {
      queryBuilder.addSelect('user.password');
    }
    queryBuilder.leftJoinAndSelect('user.roles', 'roles');
    return queryBuilder.getOne();
  }

  /**
   *
   * Updates a user's information based on the provided ID and data.
   * Validates the input DTO and checks if the user exists.
   * If role IDs are provided, fetches roles and updates the user's roles.
   * @param id - ID of the user to update
   * @param body - Data for updating the user, validated via UpdateUserDto
   * @returns {Promise<boolean>} - Returns true if the update was successful, otherwise false
   */
  async update(id: number, body: UpdateUserDto): Promise<boolean> {
    body = await validateDto(body, UpdateUserDto);

    const theUser = await this.findOne({ id });
    if (!theUser) throw new BadRequestException('general.notFound');

    const { roleIds } = body;
    let roles: Role[];
    if (roleIds && roleIds.length > 0) {
      roles = await this.roleService.findAllInIds(roleIds);
      if (roles?.length === 0) throw new BadRequestException('general.invalid');
    }

    const result = await this.userRepository.update(id, { ...body, roles });
    return !!result.affected;
  }

  /**
   *
   * @param {number}id
   * @param {string}password
   * @returns {Promise<boolean>}
   */
  async setPassword(id: number, password: string): Promise<boolean> {
    const hashingPassword = this.passwordService.hashingPassword(password);
    const result = await this.userRepository.update(id, {
      password: hashingPassword,
    });
    return !!result.affected;
  }

  /**
   *
   * Performs a soft delete (logical delete) on users by their IDs.
   * @param ids - Array of user IDs to soft delete
   * @returns {Promise<boolean>} - Returns true if the operation was successful, otherwise false
   */
  async softDelete(ids: number[]): Promise<boolean> {
    const result = await this.userRepository.softDelete(ids);
    return !!result.affected;
  }

  /**
   *
   *  Restores users that have been soft deleted by their IDs.
   * @param ids - Array of user IDs to restore
   * @returns {Promise<boolean>} - Returns true if the restoration was successful, otherwise false
   */
  async restore(ids: number[]): Promise<boolean> {
    const result = await this.userRepository.restore(ids);
    return !!result.affected;
  }

  /**
   *
   * Deletes users permanently based on their IDs.
   * @param ids - Array of user IDs to delete
   * @returns {Promise<boolean>} - Returns true if deletion was successful, otherwise false
   */
  async delete(ids: number[]): Promise<boolean> {
    const result = await this.userRepository.delete(ids);
    return !!result.affected;
  }
}
