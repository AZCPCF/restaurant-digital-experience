import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/repository.base.js';
import { MenuEntity } from '../entities/menu.entity.js';
import { MenuFilterMapper } from './menu.filter-mapper.js';
import { InjectRepository } from '@nestjs/typeorm';

export class MenuRepository extends BaseRepository<MenuEntity> {
  constructor(
    @InjectRepository(MenuEntity)
    protected readonly menuEntity: Repository<MenuEntity>,
    protected readonly menuFilterMapper: MenuFilterMapper,
  ) {
    super(menuEntity, menuFilterMapper);
  }
}
