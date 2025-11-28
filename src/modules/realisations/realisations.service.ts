import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealisationEntity } from './entities/realisation.entity';
import { CreateRealisationDto } from './dto/create-realisation.dto';
import { UpdateRealisationDto } from './dto/update-realisation.dto';
import { QueryRealisationDto } from './dto/query-realisation.dto';
import { S3Service } from '../../common/services/s3.service';

@Injectable()
export class RealisationsService {
  constructor(
    @InjectRepository(RealisationEntity)
    private readonly realisationRepository: Repository<RealisationEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(dto: CreateRealisationDto) {
    const realisation = this.realisationRepository.create(dto);
    return this.realisationRepository.save(realisation);
  }

  async findAll(query: QueryRealisationDto) {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      status,
      locale,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.realisationRepository.createQueryBuilder('realisation');

    if (search) {
      queryBuilder.andWhere(
        '(realisation.title ILIKE :search OR realisation.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('realisation.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('realisation.status = :status', {
        status,
      });
    }

    if (locale) {
      queryBuilder.andWhere('realisation.locale = :locale', { locale });
    }

    queryBuilder
      .orderBy('realisation.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllPublic(query: QueryRealisationDto) {
    return this.findAll({
      ...query,
      status: 'published',
    });
  }

  async findOne(id: string) {
    const realisation = await this.realisationRepository.findOne({
      where: { id },
    });
    if (!realisation) {
      throw new NotFoundException(`Realisation with ID ${id} not found`);
    }
    return realisation;
  }

  async update(id: string, dto: UpdateRealisationDto) {
    const realisation = await this.findOne(id);

    Object.assign(realisation, dto);

    return this.realisationRepository.save(realisation);
  }

  async remove(id: string) {
    const realisation = await this.findOne(id);

    // Delete associated images from S3
    if (realisation.images && realisation.images.length > 0) {
      for (const imageUrl of realisation.images) {
        try {
          await this.s3Service.deleteFile(imageUrl);
        } catch (error) {
          console.error(`Failed to delete image: ${imageUrl}`, error);
        }
      }
    }

    await this.realisationRepository.remove(realisation);
    return { message: 'Realisation deleted successfully' };
  }

  async getPresignedUploadUrl(filename: string) {
    return this.s3Service.getPresignedUploadUrl('realisations', filename);
  }
}
