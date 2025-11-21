import { ACCESS } from '@configs/role.config';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { TimestampedEntity } from '@common/entities.common';

@Entity('role')
export class Role extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
    unique: true,
    transformer: {
      to: (value: string) => value.trim().toUpperCase(),
      from: (value: string) => value,
    },
  })
  code: string;

  @Column({ type: 'nvarchar', length: 400, nullable: true })
  description: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  permissions: ACCESS[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @Exclude()
  load(u: Partial<Role>) {
    Object.assign(this, u);
  }
}
