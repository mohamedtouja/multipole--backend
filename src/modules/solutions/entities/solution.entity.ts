import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('solutions')
export class SolutionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 5, default: 'fr' })
  locale: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
