import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
}
