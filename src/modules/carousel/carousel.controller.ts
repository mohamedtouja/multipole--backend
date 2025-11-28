import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/v1/content/carousel')
export class CarouselPublicController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.carouselService.findAll(locale);
  }
}

@Controller('api/v1/admin/carousel')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class CarouselAdminController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  create(@Body() dto: CreateCarouselDto) {
    return this.carouselService.create(dto);
  }

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.carouselService.findAllAdmin(locale);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carouselService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarouselDto) {
    return this.carouselService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carouselService.remove(id);
  }

  @Post('upload-url')
  getUploadUrl(@Body('fileName') fileName: string) {
    return this.carouselService.getPresignedUploadUrl(fileName);
  }
}
