import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsDateString,
  MaxLength,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateRealisationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  clientName?: string;

  @IsOptional()
  @IsString()
  projectDate?: string;

  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: string;

  @IsOptional()
  featured?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  locale?: string;
}
