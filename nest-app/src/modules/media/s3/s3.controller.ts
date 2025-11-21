import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaS3Service } from './s3.service';
import { Auth } from '@src/common/decorators/auth.decorator';
import { FileUploadDto, FileUploadMultipleDto } from '../dto/upload.dto';
import { FastifyFileInterceptor } from '@src/interceptors/upload/fastify-file.interceptor';
import { ACCESS } from '@src/configs/role.config';
import { FastifyFilesInterceptor } from '@src/interceptors/upload/fastify-files.interceptor';

@ApiTags('Media (S3)')
@Controller('v1/media/s3')
export class MediaS3Controller {
  constructor(private readonly mediaS3Service: MediaS3Service) {}

  @Post('upload')
  @Auth(ACCESS.UPLOAD_FILE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload single file to S3' })
  @UseInterceptors(
    FastifyFileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() _body: FileUploadDto,
  ) {
    const data = await this.mediaS3Service.uploadFile(file);
    return { message: 'Uploaded successfully.', data };
  }

  @Post('upload-large')
  @Auth(ACCESS.UPLOAD_FILE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload large single file to S3' })
  @UseInterceptors(
    FastifyFileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 1024 * 1 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadLarge(
    @UploadedFile() file: Express.Multer.File,
    @Body() _body: FileUploadDto,
  ) {
    const data = await this.mediaS3Service.uploadLargeFile({
      file,
      queueSize: 10,
      partSize: 100,
    });
    return { message: 'Uploaded successfully.', data };
  }

  @Post('upload-multiple')
  @Auth(ACCESS.UPLOAD_FILE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload multiple file to S3' })
  @UseInterceptors(
    FastifyFilesInterceptor([{ name: 'files', maxCount: 5 }], {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadMultiple(
    @UploadedFiles()
    files: { files: Express.Multer.File[] },
    @Body() _body: FileUploadMultipleDto,
  ) {
    const data = await this.mediaS3Service.uploadFiles(files.files);
    return { message: 'Uploaded successfully.', data: { data } };
  }
}
