import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { noWhitespaceRegex } from '@common/utils/regex.utils';
import { Expose } from 'class-transformer';
import { Comparison } from '@common/decorators/comparison.decorator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {}

export class UpdateMyProfileDto {}

export class SetPasswordDto {
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
  newPassword: string;

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
  @Comparison<SetPasswordDto>('newPassword', 'eq')
  @Expose()
  confirmPassword: string;
}
