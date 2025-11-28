import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarouselEntity } from './entities/carousel.entity';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { S3Service } from '../../common/services/s3.service';

@Injectable()
export class CarouselService {
  constructor(
    @InjectRepository(CarouselEntity)
    private readonly carouselRepository: Repository<CarouselEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(dto: CreateCarouselDto) {
    const carousel = this.carouselRepository.create(dto);
    return this.carouselRepository.save(carousel);
  }

  async findAll(locale?: string) {
    const queryBuilder = this.carouselRepository.createQueryBuilder('carousel');

    if (locale) {
      queryBuilder.where('carousel.locale = :locale', { locale });
    }

    queryBuilder
      .andWhere('carousel.isActive = :isActive', { isActive: true })
      .orderBy('carousel.order', 'ASC');

    return queryBuilder.getMany();
  }

  async findAllAdmin(locale?: string) {
    const queryBuilder = this.carouselRepository.createQueryBuilder('carousel');

    if (locale) {
      queryBuilder.where('carousel.locale = :locale', { locale });
    }

    queryBuilder.orderBy('carousel.order', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const carousel = await this.carouselRepository.findOne({ where: { id } });
    if (!carousel) {
      throw new NotFoundException(`Carousel with ID ${id} not found`);
    }
    return carousel;
  }

  async update(id: string, dto: UpdateCarouselDto) {
    const carousel = await this.findOne(id);
    Object.assign(carousel, dto);
    return this.carouselRepository.save(carousel);
  }

  async remove(id: string) {
    const carousel = await this.findOne(id);
    await this.carouselRepository.remove(carousel);
    return { message: 'Carousel deleted successfully' };
  }

  async getPresignedUploadUrl(fileName: string) {
    return this.s3Service.getPresignedUploadUrl('carousel', fileName);
  }
}
