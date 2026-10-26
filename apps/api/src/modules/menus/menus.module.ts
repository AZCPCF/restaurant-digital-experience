import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { MenuEntity } from './entities/menu.entity.js';
import { MenusController } from './menus.controller.js';
import { MenusService } from './menus.service.js';
import { MenuFilterMapper } from './repositories/menu.filter-mapper.js';
import { MenuQueryMapper } from './repositories/menu.query-mapper.js';
import { MenuRepository } from './repositories/menu.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity]), RestaurantsModule],
  controllers: [MenusController],
  providers: [MenusService, MenuFilterMapper, MenuQueryMapper, MenuRepository],
  exports: [MenuRepository, MenuQueryMapper],
})
export class MenusModule {}
