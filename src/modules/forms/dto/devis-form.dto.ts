import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  IsObject,
  ValidateNested,
  MaxLength,
  MinLength,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class DimensionsDto {
  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  depth?: number;
}

export class DevisFormDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(50)
  phone: string;

  @IsString()
  @MaxLength(255)
  company: string;

  @IsString()
  @MaxLength(255)
  projectType: string;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  budget?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsOptional()
  @IsDateString()
  desiredDeliveryDate?: string;

  @IsBoolean()
  acceptTerms: boolean;
}
