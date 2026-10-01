import { Migration } from '@mikro-orm/migrations';

// Originally added a unique constraint on "number", which fails on prod because of legacy
// duplicates (1-12). Uniqueness now lives on "gstSerial" instead. Kept as a cleanup step for
// environments where the original version did apply.
export class Migration20260811120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "document_invoice" drop constraint if exists "document_invoice_number_unique";`);
  }

  override async down(): Promise<void> {
  }

}
