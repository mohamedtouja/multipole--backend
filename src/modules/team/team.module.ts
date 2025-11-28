import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './entities/team.entity';
import { TeamService } from './team.service';
import { TeamPublicController, TeamAdminController } from './team.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity]), CommonModule],
  controllers: [TeamPublicController, TeamAdminController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
