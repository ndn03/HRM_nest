import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { noWhitespaceRegex } from '@common/utils/regex.utils';
import { Expose } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, type: String, maxLength: 191 })
  @IsNotEmpty()
  @MaxLength(191)
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({ required: true, type: String, maxLength: 191 })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(191)
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 32,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(noWhitespaceRegex)
  @Expose()
  password: string;

  @ApiProperty({ type: [Number], required: true })
  @IsArray()
  @IsInt({ each: true })
  @ArrayNotEmpty()
  @Expose()
  roleIds: number[];

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive: boolean;
}
