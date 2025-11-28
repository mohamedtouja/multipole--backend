import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { BlogEntity } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { BlogStatus } from '../../common/enums/blog-status.enum';
import { S3Service } from '../../common/services/s3.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(dto: CreateBlogDto) {
    const blog = this.blogRepository.create({
      ...dto,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
    });
    return this.blogRepository.save(blog);
  }

  async findAll(query: QueryBlogDto) {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      status,
      tag,
      locale,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.blogRepository.createQueryBuilder('blog');

    if (search) {
      queryBuilder.andWhere(
        '(blog.title ILIKE :search OR blog.excerpt ILIKE :search OR blog.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('blog.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('blog.status = :status', { status });
    }

    if (tag) {
      queryBuilder.andWhere(':tag = ANY(blog.tags)', { tag });
    }

    if (locale) {
      queryBuilder.andWhere('blog.locale = :locale', { locale });
    }

    queryBuilder.orderBy('blog.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllPublic(query: QueryBlogDto) {
    return this.findAll({
      ...query,
      status: BlogStatus.PUBLISHED,
    });
  }

  async findOne(id: string) {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return blog;
  }

  async findBySlug(slug: string) {
    const blog = await this.blogRepository.findOne({ where: { slug } });
    if (!blog) {
      throw new NotFoundException(`Blog post with slug ${slug} not found`);
    }

    // Increment views
    await this.blogRepository.increment({ id: blog.id }, 'views', 1);

    return blog;
  }

  async update(id: string, dto: UpdateBlogDto) {
    const blog = await this.findOne(id);

    Object.assign(blog, {
      ...dto,
      publishedAt: dto.publishedAt
        ? new Date(dto.publishedAt)
        : blog.publishedAt,
      scheduledAt: dto.scheduledAt
        ? new Date(dto.scheduledAt)
        : blog.scheduledAt,
    });

    return this.blogRepository.save(blog);
  }

  async remove(id: string) {
    const blog = await this.findOne(id);
    await this.blogRepository.remove(blog);
    return { message: 'Blog post deleted successfully' };
  }

  async publish(id: string) {
    const blog = await this.findOne(id);
    blog.status = BlogStatus.PUBLISHED;
    blog.publishedAt = new Date();
    return this.blogRepository.save(blog);
  }

  async schedule(id: string, scheduledAt: Date) {
    const blog = await this.findOne(id);
    blog.status = BlogStatus.SCHEDULED;
    blog.scheduledAt = scheduledAt;
    return this.blogRepository.save(blog);
  }

  async getPresignedUploadUrl(fileName: string) {
    return this.s3Service.getPresignedUploadUrl('blog', fileName);
  }
}
