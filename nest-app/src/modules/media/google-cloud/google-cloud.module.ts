import { Module } from '@nestjs/common';
import { MediaService } from '../media.service';
import { MediaGoogleCloudController } from './google-cloud.controller';
import { MediaGoogleCloudService } from './google-cloud.service';

@Module({
  imports: [],
  controllers: [MediaGoogleCloudController],
  providers: [MediaService, MediaGoogleCloudService],
  exports: [MediaGoogleCloudService],
})
export class MediaGoogleCloudModule {}
