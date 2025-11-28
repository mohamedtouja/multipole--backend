import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('models_3d')
export class Model3DEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  category: string; // 'plv', 'packaging', 'custom', etc.

  @Column({ type: 'text' })
  modelUrl: string; // S3 URL to .glb or .gltf file

  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string; // Preview image

  @Column({ type: 'json', nullable: true })
  defaultSettings?: {
    colors?: string[];
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
    };
    materials?: string[];
    [key: string]: any;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', length: 10, default: 'fr' })
  locale: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
