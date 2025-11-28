import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateRealisationsFields1699999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename columns to match dashboard expectations
    await queryRunner.renameColumn('realisations', 'client', 'clientName');
    await queryRunner.renameColumn('realisations', 'completedAt', 'projectDate');
    await queryRunner.renameColumn('realisations', 'visibility', 'status');
    await queryRunner.renameColumn('realisations', 'features', 'technologies');

    // Change projectDate from date to varchar
    await queryRunner.changeColumn(
      'realisations',
      'projectDate',
      new TableColumn({
        name: 'projectDate',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );

    // Add new columns
    await queryRunner.addColumn(
      'realisations',
      new TableColumn({
        name: 'thumbnail',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'realisations',
      new TableColumn({
        name: 'featured',
        type: 'boolean',
        default: false,
      }),
    );

    // Make images nullable
    await queryRunner.changeColumn(
      'realisations',
      'images',
      new TableColumn({
        name: 'images',
        type: 'text',
        isNullable: true,
      }),
    );

    // Update status default value from 'visible' to 'draft'
    await queryRunner.changeColumn(
      'realisations',
      'status',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '20',
        default: "'draft'",
      }),
    );

    // Drop unused columns
    await queryRunner.dropColumn('realisations', 'width');
    await queryRunner.dropColumn('realisations', 'height');
    await queryRunner.dropColumn('realisations', 'depth');
    await queryRunner.dropColumn('realisations', 'technicalDetails');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert all changes
    await queryRunner.renameColumn('realisations', 'clientName', 'client');
    await queryRunner.renameColumn('realisations', 'projectDate', 'completedAt');
    await queryRunner.renameColumn('realisations', 'status', 'visibility');
    await queryRunner.renameColumn('realisations', 'technologies', 'features');

    await queryRunner.changeColumn(
      'realisations',
      'completedAt',
      new TableColumn({
        name: 'completedAt',
        type: 'date',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('realisations', 'thumbnail');
    await queryRunner.dropColumn('realisations', 'featured');

    await queryRunner.changeColumn(
      'realisations',
      'images',
      new TableColumn({
        name: 'images',
        type: 'text',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'realisations',
      'visibility',
      new TableColumn({
        name: 'visibility',
        type: 'varchar',
        length: '20',
        default: "'visible'",
      }),
    );

    // Restore dropped columns
    await queryRunner.addColumn(
      'realisations',
      new TableColumn({
        name: 'width',
        type: 'numeric',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'realisations',
      new TableColumn({
        name: 'height',
        type: 'numeric',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'realisations',
      new TableColumn({
        name: 'depth',
        type: 'numeric',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'realisations',
      new TableColumn({
        name: 'technicalDetails',
        type: 'text',
        isNullable: true,
      }),
    );
  }
}
