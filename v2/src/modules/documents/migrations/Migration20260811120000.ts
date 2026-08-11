import { Migration } from '@mikro-orm/migrations';

export class Migration20260811120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "document_invoice" add constraint "document_invoice_number_unique" unique ("number");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "document_invoice" drop constraint if exists "document_invoice_number_unique";`);
  }

}
