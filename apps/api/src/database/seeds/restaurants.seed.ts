import 'dotenv/config';

import { DataSource } from 'typeorm';

import { MenuEntity } from '../../modules/menus/entities/menu.entity.js';
import { RestaurantEntity } from '../../modules/restaurants/entities/restaurant.entity.js';

const dataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_DATABASE,

  entities: [RestaurantEntity, MenuEntity],

  synchronize: false,
});

const restaurantNames = [
  'Tehran Restaurant',
  'Shiraz Restaurant',
  'Isfahan Restaurant',
  'Tabriz Restaurant',
  'Caspian Restaurant',
  'Persian Garden Restaurant',
  'Royal Restaurant',
  'Golden Plate Restaurant',
  'Blue Moon Restaurant',
  'Green Garden Restaurant',
  'Red House Restaurant',
  'White Palace Restaurant',
  'Diamond Restaurant',
  'Pearl Restaurant',
  'Sunset Restaurant',
  'Sunrise Restaurant',
  'Olive Restaurant',
  'Saffron Restaurant',
  'Basil Restaurant',
  'Mint Restaurant',
  'Rose Restaurant',
  'Jasmine Restaurant',
  'Lotus Restaurant',
  'Pomegranate Restaurant',
  'Cedar Restaurant',
  'Palm Restaurant',
  'Ocean Restaurant',
  'Mountain Restaurant',
  'Forest Restaurant',
  'Garden House Restaurant',
  'Urban Restaurant',
  'Central Restaurant',
  'Downtown Restaurant',
  'City Restaurant',
  'Grand Restaurant',
  'Modern Restaurant',
  'Classic Restaurant',
  'Family Restaurant',
  'Premium Restaurant',
  'Royal Garden Restaurant',
  'Persian Palace Restaurant',
  'Tehran Grand Restaurant',
  'Shiraz Garden Restaurant',
  'Caspian Palace Restaurant',
  'Golden Garden Restaurant',
  'Blue Garden Restaurant',
  'Green Palace Restaurant',
  'Diamond Palace Restaurant',
  'Sunset Garden Restaurant',
  'Pearl Garden Restaurant',
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function createDate(daysFromStart: number): Date {
  const date = new Date('2026-01-01T12:00:00.000Z');

  date.setUTCDate(date.getUTCDate() + daysFromStart);

  return date;
}

async function seed() {
  await dataSource.initialize();

  try {
    const restaurantRepository = dataSource.getRepository(RestaurantEntity);
    const menuRepository = dataSource.getRepository(MenuEntity);

    /*
     * Restaurants
     */
    for (let index = 0; index < restaurantNames.length; index++) {
      const name = restaurantNames[index];

      const slug = `${slugify(name)}-${index + 1}`;

      const exists = await restaurantRepository.findOne({
        where: { slug },
      });

      if (exists) {
        console.log(`↪ Already exists: ${name}`);

        continue;
      }

      const restaurant = restaurantRepository.create({
        name,
        slug,
        created_at: createDate(index * 2),
      });

      await restaurantRepository.save(restaurant);

      console.log(`✓ Created: ${name}`);
    }

    /*
     * Menus
     */
    const savedRestaurants = await restaurantRepository.find({
      order: {
        created_at: 'ASC',
      },
    });

    for (let index = 0; index < savedRestaurants.length; index++) {
      const restaurant = savedRestaurants[index];

      const menus = [
        {
          name: 'Main Menu',
          slug: `main-menu-${index + 1}`,
          description: 'Our main restaurant menu',
          isActive: true,
          created_at: createDate(index * 2 + 1),
        },
        {
          name: 'Drinks',
          slug: `drinks-${index + 1}`,
          description: 'Hot and cold drinks',
          isActive: true,
          created_at: createDate(index * 2 + 2),
        },
      ];

      for (const menuData of menus) {
        const exists = await menuRepository.findOne({
          where: {
            restaurantId: restaurant.id,
            slug: menuData.slug,
          },
        });

        if (exists) {
          console.log(
            `↪ Already exists: ${restaurant.name} → ${menuData.name}`,
          );

          continue;
        }

        const menu = menuRepository.create({
          name: menuData.name,
          slug: menuData.slug,
          description: menuData.description,
          isActive: menuData.isActive,
          restaurantId: restaurant.id,
          created_at: menuData.created_at,
        });

        await menuRepository.save(menu);

        console.log(`✓ Created: ${restaurant.name} → ${menuData.name}`);
      }
    }

    console.log(
      `\nSeed completed. Restaurants: ${await restaurantRepository.count()}, Menus: ${await menuRepository.count()}`,
    );
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('Seed failed:', error);

  process.exit(1);
});
