import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: String, format: 'binary' })
  file: string;
}

export class FileUploadMultipleDto {
  @ApiProperty({ type: [String], format: 'binary' })
  files: string[];
}
