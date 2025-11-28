import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarouselEntity } from './entities/carousel.entity';
import { CarouselService } from './carousel.service';
import {
  CarouselPublicController,
  CarouselAdminController,
} from './carousel.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarouselEntity]), CommonModule],
  controllers: [CarouselPublicController, CarouselAdminController],
  providers: [CarouselService],
  exports: [CarouselService],
})
export class CarouselModule {}
