import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "wizard_feedback" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"distro_slug" varchar NOT NULL,
  	"rank" numeric NOT NULL,
  	"score" numeric NOT NULL,
  	"confidence" numeric NOT NULL,
  	"answers" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "wizard_feedback_id" integer;
  CREATE INDEX "wizard_feedback_distro_slug_idx" ON "wizard_feedback" USING btree ("distro_slug");
  CREATE INDEX "wizard_feedback_updated_at_idx" ON "wizard_feedback" USING btree ("updated_at");
  CREATE INDEX "wizard_feedback_created_at_idx" ON "wizard_feedback" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wizard_feedback_fk" FOREIGN KEY ("wizard_feedback_id") REFERENCES "public"."wizard_feedback"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_wizard_feedback_id_idx" ON "payload_locked_documents_rels" USING btree ("wizard_feedback_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "wizard_feedback" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "wizard_feedback" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_wizard_feedback_fk";
  
  DROP INDEX "payload_locked_documents_rels_wizard_feedback_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "wizard_feedback_id";`)
}
