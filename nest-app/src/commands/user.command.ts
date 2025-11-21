import { BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '@common/services/password.service';
import { ERole } from '@configs/role.config';
import { Role } from '@entities/role.entity';
import { User } from '@entities/user.entity';
import { isEmail, minLength } from 'class-validator';
import { Command, Console, createSpinner } from 'nestjs-console';
import { Repository } from 'typeorm';

@Console({ command: 'user', description: 'User command management' })
export class UserCommand {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly passwordService: PasswordService,
  ) {}

  @Command({
    command: 'init:user <email> <password>', // Define the command 'init:user' with parameters 'email' and 'password'
    description: 'Init user',
  })
  async initUser(email: string, password: string): Promise<void> {
    const spin = createSpinner();
    try {
      spin.start('Start choosing action for user creation');
      if (!isEmail(email)) throw new BadRequestException('Email invalid!');
      if (password.includes(' '))
        throw new BadRequestException('Password cannot contain spaces!');
      if (!minLength(password, 3))
        throw new BadRequestException(
          'Password must be at least 3 characters!',
        );

      // Fetch the "ADMINISTRATOR" role from the database
      const adminRole = await this.roleRepository.findOneBy({
        code: ERole.ADMINISTRATOR,
      });

      // Throw an error if the "ADMINISTRATOR" role does not exist
      if (!adminRole)
        throw new BadRequestException('ADMINISTRATOR role not found!');

      // Check if a user with the provided email already exists in the database
      const existingUserByEmail = await this.userRepository.findOneBy({
        email,
      });
      if (existingUserByEmail) {
        throw new BadRequestException('User with this email already exists!');
      }

      // Create a new User entity
      const adminUser = new User(this.passwordService);
      adminUser.email = email;
      adminUser.password = password;
      adminUser.roles = [adminRole];
      adminUser.is_active = true;

      // Save the new user to the database
      const user = await this.userRepository.save(adminUser);
      Logger.debug('🚀 ~ Admin user has been created with ADMIN role:', user);
      spin.succeed('User created successfully');
    } catch (error) {
      Logger.error('🚀 ~ UserCommand ~ initUser ~ error:', error);
      spin.fail('User creation failed');
    }
  }
}
