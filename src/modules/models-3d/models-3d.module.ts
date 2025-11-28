import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model3DEntity } from './entities/model-3d.entity';
import { Models3DService } from './models-3d.service';
import {
  Models3DPublicController,
  Models3DAdminController,
} from './models-3d.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Model3DEntity]), CommonModule],
  controllers: [Models3DPublicController, Models3DAdminController],
  providers: [Models3DService],
  exports: [Models3DService],
})
export class Models3DModule {}
