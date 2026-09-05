import 'dotenv/config';

import { DataSource } from 'typeorm';

import { RestaurantEntity } from '../../modules/restaurants/entities/restaurant.entity.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [RestaurantEntity],
  synchronize: false,
});

const restaurants = [
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

async function seed() {
  await dataSource.initialize();

  try {
    const repository = dataSource.getRepository(RestaurantEntity);

    for (const name of restaurants) {
      const slug = slugify(name);

      const exists = await repository.findOne({
        where: { slug },
      });

      if (exists) {
        console.log(`↪ Already exists: ${name}`);
        continue;
      }

      const restaurant = repository.create({
        name,
        slug,
      });

      await repository.save(restaurant);

      console.log(`✓ Created: ${name}`);
    }

    console.log(
      `\nSeed completed. Total restaurants: ${await repository.count()}`,
    );
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
