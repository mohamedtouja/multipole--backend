import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('devis_forms')
export class DevisFormEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'varchar', length: 255 })
  projectType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  budget?: string;

  @Column({ type: 'int', nullable: true })
  quantity?: number;

  @Column({ type: 'jsonb', nullable: true })
  dimensions?: { width?: number; height?: number; depth?: number };

  @Column({ type: 'date', nullable: true })
  desiredDeliveryDate?: Date;

  @Column({ type: 'boolean', default: false })
  acceptTerms: boolean;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;
}
