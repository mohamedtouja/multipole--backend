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
import { SolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/v1/content/solutions')
export class SolutionsPublicController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.solutionsService.findAll(locale);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solutionsService.findOne(id);
  }
}

@Controller('api/v1/admin/solutions')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class SolutionsAdminController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Post()
  create(@Body() dto: CreateSolutionDto) {
    return this.solutionsService.create(dto);
  }

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.solutionsService.findAll(locale);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solutionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSolutionDto) {
    return this.solutionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solutionsService.remove(id);
  }

  @Post('upload-url')
  getUploadUrl(@Body('fileName') fileName: string) {
    return this.solutionsService.getPresignedUploadUrl(fileName);
  }
}
