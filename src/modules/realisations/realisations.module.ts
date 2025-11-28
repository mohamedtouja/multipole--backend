import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealisationEntity } from './entities/realisation.entity';
import { RealisationsService } from './realisations.service';
import {
  RealisationsPublicController,
  RealisationsAdminController,
} from './realisations.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([RealisationEntity]), CommonModule],
  controllers: [RealisationsPublicController, RealisationsAdminController],
  providers: [RealisationsService],
  exports: [RealisationsService],
})
export class RealisationsModule {}
