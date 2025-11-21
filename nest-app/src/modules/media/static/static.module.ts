import { Module } from '@nestjs/common';
import { MediaService } from '../media.service';
import { MediaStaticController } from './static.controller';
import { MediaStaticService } from './static.service';

@Module({
  imports: [],
  controllers: [MediaStaticController],
  providers: [MediaService, MediaStaticService],
  exports: [MediaStaticService],
})
export class MediaStaticModule {}
