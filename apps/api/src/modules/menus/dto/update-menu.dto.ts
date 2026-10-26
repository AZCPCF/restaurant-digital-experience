import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto.js';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
