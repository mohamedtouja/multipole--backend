import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSolutionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  locale?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
