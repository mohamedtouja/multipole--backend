import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsObject,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateModel3DDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MaxLength(100)
  category: string;

  @IsString()
  modelUrl: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsObject()
  defaultSettings?: {
    colors?: string[];
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
    };
    materials?: string[];
    [key: string]: any;
  };

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;
}
