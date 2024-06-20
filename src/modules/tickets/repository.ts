import { Insertable, Selectable } from 'kysely'
import { keys } from './schema'
import type { Database, Ticket } from '@/database'
import BadRequest from '@/utils/errors/BadRequest'

const TABLE = 'tickets'
// type TableName = typeof TABLE
type Row = Ticket
type RowWithoutId = Omit<Row, 'id'>
type RowRelationshipsIds = Pick<Row, 'screeningId'>
type RowInsert = Insertable<RowWithoutId>
// type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<
  Ticket & { movieTitle: string; screeningTime: string }
>

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .innerJoin('screenings', 'tickets.screeningId', 'screenings.id')
      .innerJoin('movies', 'screenings.movieId', 'movies.id')
      .select([
        'tickets.id as id',
        'screenings.screeningTime',
        'movies.title as movieTitle',
        'tickets.screeningId',
        'tickets.createdAt',
      ])
      .execute()
  },
  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .innerJoin('screenings', 'tickets.screeningId', 'screenings.id')
      .innerJoin('movies', 'screenings.movieId', 'movies.id')
      .select([
        'tickets.id as id',
        'screenings.screeningTime',
        'movies.title as movieTitle',
        'tickets.screeningId',
        'tickets.createdAt',
      ])
      .where('id', '=', id)
      .executeTakeFirst()
  },
  async create(record: RowInsert): Promise<Selectable<Row> | undefined> {
    await assertRelationshipsExist(db, record)

    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()
  },
})

/**
 * Enforce that provided relationships reference existing keys.
 */
async function assertRelationshipsExist(
  db: Database,
  record: Partial<RowRelationshipsIds>
) {
  const { screeningId } = record

  if (screeningId) {
    const screening = await db
      .selectFrom('screenings')
      .select('id')
      .where('id', '=', screeningId)
      .executeTakeFirst()

    if (!screening) {
      throw new BadRequest('Referenced movie does not exist')
    }
  }
}
