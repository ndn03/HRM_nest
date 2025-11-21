import { Module } from '@nestjs/common';
import { MediaS3Controller } from './s3.controller';
import { MediaS3Service } from './s3.service';
import { MediaService } from '../media.service';

@Module({
  imports: [],
  controllers: [MediaS3Controller],
  providers: [MediaService, MediaS3Service],
  exports: [MediaS3Service],
})
export class MediaS3Module {}
