import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MediaGoogleCloudService } from './google-cloud.service';

@ApiTags('Media (Google cloud)')
@Controller('v1/media/google-cloud')
export class MediaGoogleCloudController {
  constructor(
    private readonly mediaGoogleCloudService: MediaGoogleCloudService,
  ) {}
}
