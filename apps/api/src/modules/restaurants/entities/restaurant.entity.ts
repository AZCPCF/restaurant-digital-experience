import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { MenuEntity } from '../../menus/entities/menu.entity.js';
@Entity('restaurants')
export class RestaurantEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 }) name: string;
  @Column({ type: 'varchar', length: 255, unique: true }) slug: string;
  @OneToMany(() => MenuEntity, (menu) => menu.restaurant) menus: MenuEntity[];
}
