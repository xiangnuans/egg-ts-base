import { PrimaryGeneratedColumn, UpdateDateColumn, Index, CreateDateColumn } from 'typeorm';
 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint'})
  id: number;
  @Index()
  @CreateDateColumn()
  createTime: Date;
  @UpdateDateColumn()
  updateTime: Date;
}