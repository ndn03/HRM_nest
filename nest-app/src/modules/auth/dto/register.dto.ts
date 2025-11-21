import { ApiProperty } from '@nestjs/swagger';
import { Comparison } from '@common/decorators/comparison.decorator';
import { noWhitespaceRegex } from '@common/utils/regex.utils';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: String, required: true, example: 'admin123' })
  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({ type: String, required: true, example: 'example@solashi.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 32,
    required: true,
    example: 'dad45Dew@mKdfR',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(noWhitespaceRegex)
  @Expose()
  password: string;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 32,
    required: true,
    example: 'dad45Dew@mKdfR',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(noWhitespaceRegex)
  @Comparison<RegisterDto>('password', 'eq')
  @Expose()
  confirmPassword: string;
}
