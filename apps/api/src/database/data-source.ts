import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { DataSource } from 'typeorm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: ['query', 'error'],
  database: process.env.DB_DATABASE,

  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,
});
