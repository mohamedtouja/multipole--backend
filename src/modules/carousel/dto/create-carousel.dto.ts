import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCarouselDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitle?: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ctaText?: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  locale?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
