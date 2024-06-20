/**
 * Migration: 20240617084852-createScreeningAndTicketsTables.ts
 */
import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>): Promise<void> {
  await db.schema
    .createTable('screenings')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('screening_time', 'datetime', (c) => c.notNull())
    .addColumn('allocated_tickets', 'integer', (c) => c.notNull())
    .addColumn('left_tickets', 'integer', (c) => c.notNull())
    .addColumn('movie_id', 'integer', (c) =>
      c.references('movies.id').onDelete('cascade').notNull()
    )
    .execute()

  await db.schema
    .createTable('tickets')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('screening_id', 'integer', (c) =>
      c.references('screenings.id').onDelete('cascade').notNull()
    )
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(new Date().toISOString()).notNull()
    )
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('screenings').execute()
  await db.schema.dropTable('tickets').execute()
}
