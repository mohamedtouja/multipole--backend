import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Models3DService } from './models-3d.service';
import { CreateModel3DDto } from './dto/create-model-3d.dto';
import { UpdateModel3DDto } from './dto/update-model-3d.dto';
import { QueryModel3DDto } from './dto/query-model-3d.dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/v1/content/models-3d')
export class Models3DPublicController {
  constructor(private readonly models3DService: Models3DService) {}

  @Get()
  findAll(@Query() query: QueryModel3DDto) {
    return this.models3DService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.models3DService.findOne(id);
  }
}

@Controller('api/v1/admin/models-3d')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class Models3DAdminController {
  constructor(private readonly models3DService: Models3DService) {}

  @Post()
  create(@Body() dto: CreateModel3DDto) {
    return this.models3DService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryModel3DDto) {
    return this.models3DService.findAllAdmin(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.models3DService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModel3DDto) {
    return this.models3DService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.models3DService.remove(id);
  }

  @Post('upload-url')
  getUploadUrl(
    @Body('fileName') fileName: string,
    @Body('fileType') fileType: 'model' | 'thumbnail',
  ) {
    return this.models3DService.getPresignedUploadUrl(fileName, fileType);
  }
}
