import { User } from '@entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

export class UserTrackingEntity {
  @Column({ type: 'int', nullable: true })
  creatorId: number;
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column({ type: 'int', nullable: true })
  editorId: number;
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({ name: 'editorId' })
  editor: User;
}

export class TimestampedEntity {
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}

export class SoftDeletableEntity {
  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  deleted_at?: Date;
}

export class BaseEntity extends UserTrackingEntity {
  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  deleted_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}

export class BaseTrackedEntity extends UserTrackingEntity {
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}

export class BaseTimestampedEntity extends SoftDeletableEntity {
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}

export class BaseTrackedSoftDeleteEntity extends UserTrackingEntity {
  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  deleted_at?: Date;
}
