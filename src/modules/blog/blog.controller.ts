import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/v1/content/blog')
export class BlogPublicController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query() query: QueryBlogDto) {
    return this.blogService.findAllPublic(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }
}

@Controller('api/v1/admin/blog')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class BlogAdminController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryBlogDto) {
    return this.blogService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.blogService.publish(id);
  }

  @Post(':id/schedule')
  schedule(@Param('id') id: string, @Body('scheduledAt') scheduledAt: string) {
    return this.blogService.schedule(id, new Date(scheduledAt));
  }

  @Post('upload-url')
  getUploadUrl(@Body('fileName') fileName: string) {
    return this.blogService.getPresignedUploadUrl(fileName);
  }
}
