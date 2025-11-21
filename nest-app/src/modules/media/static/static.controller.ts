import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MediaStaticService } from './static.service';

@ApiTags('Media (Static)')
@Controller('v1/media/static')
export class MediaStaticController {
  constructor(private readonly mediaStaticService: MediaStaticService) {}
}
