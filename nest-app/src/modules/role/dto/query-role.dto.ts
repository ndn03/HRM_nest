import { QueryDto } from '@src/common/dtos/query.dto';
import { PartialType } from '@nestjs/swagger';

export class QueryRoleDto extends PartialType(QueryDto) {}
