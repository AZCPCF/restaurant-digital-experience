import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMenus1788660964307 implements MigrationInterface {
  name = 'CreateMenus1788660964307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "menus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" text, "slug" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "restaurant_id" uuid NOT NULL, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "FK_bcd4a935c967cc9c20e770d1e62" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus" DROP CONSTRAINT "FK_bcd4a935c967cc9c20e770d1e62"`,
    );
    await queryRunner.query(`DROP TABLE "menus"`);
  }
}
