import { Inject } from '@nestjs/common';
import { BaseTimestampedEntity } from '@common/entities.common';
import { PasswordService } from '@common/services/password.service';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('user')
export class User extends BaseTimestampedEntity {
  constructor(
    @Inject(PasswordService) private passwordService: PasswordService,
  ) {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    length: 191,
    nullable: false,
    transformer: {
      to: (value: string) => (value ? value.trim().toLowerCase() : value),
      from: (value: string) => value,
    },
  })
  email: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 191,
    nullable: false,
    transformer: {
      to: (value: string) => (value ? value.trim().toLowerCase() : value),
      from: (value: string) => value,
    },
  })
  username: string;

  @Column({ type: 'varchar', nullable: false, length: 191, select: false })
  @Exclude()
  password: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  is_active: boolean;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true, eager: true })
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @Exclude()
  load(u: Partial<User>) {
    Object.assign(this, u);
  }

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = this.passwordService.hashingPassword(this.password);
    }
  }

  @BeforeUpdate()
  hashPasswordBeforeUpdate() {
    if (this.password) {
      this.password = this.passwordService.hashingPassword(this.password);
    }
  }
}
