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
import { RealisationsService } from './realisations.service';
import { CreateRealisationDto } from './dto/create-realisation.dto';
import { UpdateRealisationDto } from './dto/update-realisation.dto';
import { QueryRealisationDto } from './dto/query-realisation.dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/v1/content/realisations')
export class RealisationsPublicController {
  constructor(private readonly realisationsService: RealisationsService) {}

  @Get()
  findAll(@Query() query: QueryRealisationDto) {
    return this.realisationsService.findAllPublic(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.realisationsService.findOne(id);
  }
}

@Controller('api/v1/admin/realisations')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class RealisationsAdminController {
  constructor(private readonly realisationsService: RealisationsService) {}

  @Post()
  create(@Body() dto: CreateRealisationDto) {
    return this.realisationsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryRealisationDto) {
    return this.realisationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.realisationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRealisationDto) {
    return this.realisationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.realisationsService.remove(id);
  }

  @Post('upload-url')
  getUploadUrl(@Body('fileName') fileName: string) {
    return this.realisationsService.getPresignedUploadUrl(fileName);
  }
}
