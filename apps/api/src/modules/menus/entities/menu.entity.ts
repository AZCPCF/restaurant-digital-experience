import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity.js';

import type { RestaurantEntity } from '../../restaurants/entities/restaurant.entity.js';

@Entity('menus')
export class MenuEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive?: boolean;

  @Column({
    name: 'restaurant_id',
    type: 'uuid',
  })
  restaurantId: string;

  @ManyToOne('RestaurantEntity', 'menus', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantEntity;
}
