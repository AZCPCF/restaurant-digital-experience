import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QueryDto } from '../../common/query/dto/query.dto.js';
import { QueryResult } from '../../common/query/query-result.js';
import { CreateMenuDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';
import { MenuEntity } from './entities/menu.entity.js';
import { MenusService } from './menus.service.js';
import { MenuQueryMapper } from './repositories/menu.query-mapper.js';
@Controller('menus')
export class MenusController {
  constructor(
    private readonly menusService: MenusService,
    private readonly queryMapper: MenuQueryMapper,
  ) {}

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto): Promise<MenuEntity> {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<QueryResult<MenuEntity>> {
    const options = this.queryMapper.toOptions(query);
    return this.menusService.findAll(options);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MenuEntity> {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<MenuEntity> {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MenuEntity> {
    return this.menusService.remove(id);
  }
}
