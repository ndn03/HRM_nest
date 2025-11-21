import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { azUppercaseRegex } from '@common/utils/regex.utils';
import { ACCESS } from '@configs/role.config';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ required: true, type: String, example: 'EDITOR' })
  @IsNotEmpty()
  @IsString()
  @Matches(azUppercaseRegex)
  @Expose()
  code: string;

  @ApiPropertyOptional({ type: String, maxLength: 400 })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  @Expose()
  description: string;

  @ApiPropertyOptional({ type: Array, enum: ACCESS, default: [] })
  @IsOptional()
  @IsArray()
  @IsEnum(ACCESS, { each: true })
  @Expose()
  permissions: ACCESS[];
}
