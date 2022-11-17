import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    type: Number
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    type: String
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({ type: [String]})
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    enum: ['men', 'women', 'kid', 'unisex']
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({type: [String]})
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({type: [String]})
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
