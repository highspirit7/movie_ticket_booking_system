import { type Insertable, type Selectable } from 'kysely'
import { keys } from './schema'
import type { Database, Screening } from '@/database'

const TABLE = 'screenings'
// type TableName = typeof TABLE
type Row = Screening
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
// type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  findAllAvailable: async (limit = 10, offset = 0): Promise<RowSelect[]> =>
    db
      .selectFrom(TABLE)
      .select(keys)
      .where('leftTickets', '>', 0)
      .limit(limit)
      .offset(offset)
      .execute(),

  create: async (record: RowInsert): Promise<RowSelect | undefined> =>
    db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst(),
})
