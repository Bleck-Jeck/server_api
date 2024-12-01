import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTable1731833043974 implements MigrationInterface {
    name = 'UpdateTable1731833043974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "content_ids" ("id" SERIAL NOT NULL, "content_id" integer NOT NULL, "id_type" character varying NOT NULL, "external_id" character varying NOT NULL, CONSTRAINT "PK_1d04cbd180054bfa2f66521dca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "unique_external_id_per_type" ON "content_ids" ("external_id", "id_type") `);
        await queryRunner.query(`ALTER TABLE "content_ids" ADD CONSTRAINT "FK_69814b70dfb594e3cfbb684fb1b" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_ids" DROP CONSTRAINT "FK_69814b70dfb594e3cfbb684fb1b"`);
        await queryRunner.query(`DROP INDEX "public"."unique_external_id_per_type"`);
        await queryRunner.query(`DROP TABLE "content_ids"`);
    }

}
