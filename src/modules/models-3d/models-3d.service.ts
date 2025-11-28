import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Model3DEntity } from './entities/model-3d.entity';
import { CreateModel3DDto } from './dto/create-model-3d.dto';
import { UpdateModel3DDto } from './dto/update-model-3d.dto';
import { QueryModel3DDto } from './dto/query-model-3d.dto';
import { S3Service } from '../../common/services/s3.service';

@Injectable()
export class Models3DService {
  constructor(
    @InjectRepository(Model3DEntity)
    private readonly model3DRepository: Repository<Model3DEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(dto: CreateModel3DDto) {
    const model = this.model3DRepository.create(dto);
    return this.model3DRepository.save(model);
  }

  async findAll(query: QueryModel3DDto) {
    const queryBuilder = this.model3DRepository.createQueryBuilder('model');

    // Filter by category
    if (query.category) {
      queryBuilder.andWhere('model.category = :category', {
        category: query.category,
      });
    }

    // Filter by locale
    if (query.locale) {
      queryBuilder.andWhere('model.locale = :locale', { locale: query.locale });
    }

    // Search by name or description
    if (query.search) {
      queryBuilder.andWhere(
        '(model.name ILIKE :search OR model.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Only return active models for public endpoint
    queryBuilder
      .andWhere('model.isActive = :isActive', { isActive: true })
      .orderBy('model.order', 'ASC')
      .addOrderBy('model.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findAllAdmin(query: QueryModel3DDto) {
    const queryBuilder = this.model3DRepository.createQueryBuilder('model');

    if (query.category) {
      queryBuilder.andWhere('model.category = :category', {
        category: query.category,
      });
    }

    if (query.locale) {
      queryBuilder.andWhere('model.locale = :locale', { locale: query.locale });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(model.name ILIKE :search OR model.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    queryBuilder
      .orderBy('model.order', 'ASC')
      .addOrderBy('model.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const model = await this.model3DRepository.findOne({ where: { id } });
    if (!model) {
      throw new NotFoundException(`3D Model with ID ${id} not found`);
    }
    return model;
  }

  async update(id: string, dto: UpdateModel3DDto) {
    const model = await this.findOne(id);
    Object.assign(model, dto);
    return this.model3DRepository.save(model);
  }

  async remove(id: string) {
    const model = await this.findOne(id);
    await this.model3DRepository.remove(model);
    return { message: '3D Model deleted successfully' };
  }

  async getPresignedUploadUrl(fileName: string, fileType: 'model' | 'thumbnail') {
    const folder = fileType === 'model' ? '3d-models' : '3d-thumbnails';
    return this.s3Service.getPresignedUploadUrl(folder, fileName);
  }
}
