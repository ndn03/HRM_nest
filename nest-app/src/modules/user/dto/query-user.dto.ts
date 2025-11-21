import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto, QueryWithDeleteDto } from '@src/common/dtos/query.dto';

export class QueryUserDto extends PartialType(
  IntersectionType(QueryDto, QueryWithDeleteDto),
) {}
