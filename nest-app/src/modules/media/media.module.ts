import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaS3Module } from './s3/s3.module';
import { MediaStaticModule } from './static/static.module';
import { MediaGoogleCloudModule } from './google-cloud/google-cloud.module';

@Module({
  imports: [MediaS3Module, MediaStaticModule, MediaGoogleCloudModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
