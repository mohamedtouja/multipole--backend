import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateModels3D1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'models_3d',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'modelUrl',
            type: 'text',
          },
          {
            name: 'thumbnailUrl',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'defaultSettings',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'order',
            type: 'int',
            default: 0,
          },
          {
            name: 'locale',
            type: 'varchar',
            length: '10',
            default: "'fr'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_models_3d_category" ON "models_3d" ("category")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_models_3d_locale" ON "models_3d" ("locale")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_models_3d_isActive" ON "models_3d" ("isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('models_3d');
  }
}
