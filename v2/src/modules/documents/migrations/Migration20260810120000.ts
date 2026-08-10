import { Migration } from '@mikro-orm/migrations';

export class Migration20260810120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "document_settings" add column if not exists "storeIndiaGstDetails" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "document_settings" drop column if exists "storeIndiaGstDetails";`);
  }

}
