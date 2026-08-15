import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_changelog_tags" AS ENUM('database', 'ui', 'feature', 'fix', 'roadmap', 'performance');
  CREATE TABLE "changelog_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_changelog_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "changelog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"version" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "changelog_id" integer;
  ALTER TABLE "changelog_tags" ADD CONSTRAINT "changelog_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."changelog"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "changelog_tags_order_idx" ON "changelog_tags" USING btree ("order");
  CREATE INDEX "changelog_tags_parent_idx" ON "changelog_tags" USING btree ("parent_id");
  CREATE UNIQUE INDEX "changelog_slug_idx" ON "changelog" USING btree ("slug");
  CREATE INDEX "changelog_updated_at_idx" ON "changelog" USING btree ("updated_at");
  CREATE INDEX "changelog_created_at_idx" ON "changelog" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_changelog_fk" FOREIGN KEY ("changelog_id") REFERENCES "public"."changelog"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_changelog_id_idx" ON "payload_locked_documents_rels" USING btree ("changelog_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "changelog_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "changelog" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "changelog_tags" CASCADE;
  DROP TABLE "changelog" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_changelog_fk";
  
  DROP INDEX "payload_locked_documents_rels_changelog_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "changelog_id";
  DROP TYPE "public"."enum_changelog_tags";`)
}
