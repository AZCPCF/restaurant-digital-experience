import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMenuRestaurantSlugUnique1788662155841 implements MigrationInterface {
  name = 'AddMenuRestaurantSlugUnique1788662155841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "menus"
      ADD CONSTRAINT "UQ_menus_restaurant_id_slug"
      UNIQUE ("restaurant_id", "slug")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "menus"
      DROP CONSTRAINT "UQ_menus_restaurant_id_slug"
    `);
  }
}
