import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolutionEntity } from './entities/solution.entity';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { S3Service } from '../../common/services/s3.service';

@Injectable()
export class SolutionsService {
  constructor(
    @InjectRepository(SolutionEntity)
    private readonly solutionRepository: Repository<SolutionEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(dto: CreateSolutionDto) {
    const solution = this.solutionRepository.create(dto);
    return this.solutionRepository.save(solution);
  }

  async findAll(locale?: string) {
    const queryBuilder = this.solutionRepository.createQueryBuilder('solution');

    if (locale) {
      queryBuilder.where('solution.locale = :locale', { locale });
    }

    queryBuilder.orderBy('solution.order', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const solution = await this.solutionRepository.findOne({ where: { id } });
    if (!solution) {
      throw new NotFoundException(`Solution with ID ${id} not found`);
    }
    return solution;
  }

  async update(id: string, dto: UpdateSolutionDto) {
    const solution = await this.findOne(id);
    Object.assign(solution, dto);
    return this.solutionRepository.save(solution);
  }

  async remove(id: string) {
    const solution = await this.findOne(id);
    await this.solutionRepository.remove(solution);
    return { message: 'Solution deleted successfully' };
  }

  async getPresignedUploadUrl(fileName: string) {
    return this.s3Service.getPresignedUploadUrl('solutions', fileName);
  }
}
