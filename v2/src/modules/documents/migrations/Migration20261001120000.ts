import { Migration } from '@mikro-orm/migrations';

export class Migration20261001120000 extends Migration {

  override async up(): Promise<void> {
    // DBs that ran the original 20260811 still have this constraint; rewritten migrations don't re-run there
    this.addSql(`alter table if exists "document_invoice" drop constraint if exists "document_invoice_number_unique";`);
    this.addSql(`create table if not exists "document_number" ("id" text not null, "name" text not null, "value" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "document_number_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_document_number_name_unique" ON "document_number" ("name") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_number_deleted_at" ON "document_number" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "document_invoice" add column if not exists "gstSerial" integer null, add column if not exists "order_id" text null;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_document_invoice_gstSerial_unique" ON "document_invoice" ("gstSerial") WHERE "gstSerial" IS NOT NULL AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_invoice_order_id" ON "document_invoice" ("order_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "document_number" cascade;`);

    this.addSql(`drop index if exists "IDX_document_invoice_gstSerial_unique";`);
    this.addSql(`drop index if exists "IDX_document_invoice_order_id";`);
    this.addSql(`alter table if exists "document_invoice" drop column if exists "gstSerial", drop column if exists "order_id";`);
  }

}
