import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'
import { keys } from './schema'
import type { Database, Screening, DB } from '@/database'
import BadRequest from '@/utils/errors/BadRequest'

const TABLE = 'screenings'
type TableName = typeof TABLE
type Row = Screening
type RowWithMovie = Row & { movieTitle: string; movieYear: number | null }
type RowRelationshipsIds = Pick<Row, 'movieId'>
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>
type RowSelectWithMovie = Selectable<RowWithMovie>

export default (db: Database) => ({
  findAll(
    expression?: ExpressionOrFactory<DB, TableName, SqlBool>
  ): Promise<RowSelectWithMovie[]> {
    return expression
      ? db
          .selectFrom(TABLE)
          .innerJoin('movies', 'screenings.movieId', 'movies.id')
          .where(expression)
          .select([
            'screenings.id as id',
            'allocatedTickets',
            'leftTickets',
            'screeningTime',
            'movieId',
            'movies.title as movieTitle',
            'movies.year as movieYear',
          ])
          .execute()
      : db
          .selectFrom(TABLE)
          .innerJoin('movies', 'screenings.movieId', 'movies.id')
          .select([
            'screenings.id as id',
            'allocatedTickets',
            'leftTickets',
            'screeningTime',
            'movieId',
            'movies.title as movieTitle',
            'movies.year as movieYear',
          ])
          .execute()
  },
  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .innerJoin('movies', 'screenings.movieId', 'movies.id')
      .select([
        'screenings.id as id',
        'allocatedTickets',
        'leftTickets',
        'screeningTime',
        'movieId',
        'movies.title as movieTitle',
        'movies.year as movieYear',
      ])
      .where('screenings.id', '=', id)
      .executeTakeFirst()
  },
  async create(record: RowInsert): Promise<RowSelect | undefined> {
    await assertRelationshipsExist(db, record)

    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()
  },
  update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id)
    }

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
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
  const { movieId } = record

  // we would perform both checks in a single Promise.all
  if (movieId) {
    const movie = await db
      .selectFrom('movies')
      .select('id')
      .where('id', '=', movieId)
      .executeTakeFirst()

    if (!movie) {
      throw new BadRequest('Referenced movie does not exist')
    }
  }
}
