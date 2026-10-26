import { QueryMapper } from '../../../common/query/dto/query.mapper.js';
import { MenuEntity } from '../entities/menu.entity.js';

export class MenuQueryMapper extends QueryMapper<MenuEntity> {
  constructor() {
    super({
      id: String,
      name: String,
      slug: String,
      isActive: Boolean,
      restaurantId: String,
      created_at: (value) => new Date(value),
      updated_at: (value) => new Date(value),
    });
  }
}
