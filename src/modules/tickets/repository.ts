import { Insertable, Selectable } from 'kysely'
import { keys } from './schema'
import type { Database, Ticket } from '@/database'

const TABLE = 'tickets'
// type TableName = typeof TABLE
type Row = Ticket
type RowWithoutId = Omit<Row, 'id'>
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
        'movies.year as movieYear',
        'tickets.screeningId',
        'tickets.createdAt',
      ])
      .execute()
  },
  //   findById(id: number): Promise<RowSelect | undefined> {
  //     return db
  //       .selectFrom(TABLE)
  //       .innerJoin('screenings', 'tickets.screeningId', 'screenings.id')
  //       .innerJoin('movies', 'screenings.movieId', 'movies.id')
  //       .select([
  //         'tickets.id as id',
  //         'screenings.screeningTime',
  //         'movies.title as movieTitle',
  //         'tickets.screeningId',
  //         'tickets.createdAt',
  //       ])
  //       .where('id', '=', id)
  //       .executeTakeFirst()
  //   },
  create(record: RowInsert): Promise<Selectable<Row> | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()
  },
})
