import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('carousel')
export class CarouselEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subtitle?: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ctaText?: string;

  @Column({ type: 'text', nullable: true })
  ctaLink?: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', length: 5, default: 'fr' })
  locale: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
