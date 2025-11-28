import { IsOptional, IsString } from 'class-validator';

export class QueryModel3DDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
