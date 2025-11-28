import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolutionEntity } from './entities/solution.entity';
import { SolutionsService } from './solutions.service';
import {
  SolutionsPublicController,
  SolutionsAdminController,
} from './solutions.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([SolutionEntity]), CommonModule],
  controllers: [SolutionsPublicController, SolutionsAdminController],
  providers: [SolutionsService],
  exports: [SolutionsService],
})
export class SolutionsModule {}
