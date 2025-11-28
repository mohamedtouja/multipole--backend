import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { S3Service } from '../../common/services/s3.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(dto: CreateTeamDto) {
    const team = this.teamRepository.create(dto);
    return this.teamRepository.save(team);
  }

  async findAll(locale?: string) {
    const queryBuilder = this.teamRepository.createQueryBuilder('team');

    if (locale) {
      queryBuilder.where('team.locale = :locale', { locale });
    }

    queryBuilder.orderBy('team.order', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }
    return team;
  }

  async update(id: string, dto: UpdateTeamDto) {
    const team = await this.findOne(id);
    Object.assign(team, dto);
    return this.teamRepository.save(team);
  }

  async remove(id: string) {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
    return { message: 'Team member deleted successfully' };
  }

  async getPresignedUploadUrl(fileName: string) {
    return this.s3Service.getPresignedUploadUrl('team', fileName);
  }
}
