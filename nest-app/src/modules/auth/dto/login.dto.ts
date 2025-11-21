import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'exampleUser', type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({ example: 'dad45Dew@vfsdf', type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Expose()
  password: string;
}
