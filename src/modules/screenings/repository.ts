import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
} from 'kysely'
import { keys } from './schema'
import type { Database, Screening, DB } from '@/database'

const TABLE = 'screenings'
type TableName = typeof TABLE
type Row = Screening
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
// type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  findAll: (
    expression?: ExpressionOrFactory<DB, TableName, SqlBool>
  ): Promise<RowSelect[]> =>
    expression
      ? db.selectFrom(TABLE).where(expression).select(keys).execute()
      : db.selectFrom(TABLE).select(keys).execute(),
  create: async (record: RowInsert): Promise<RowSelect | undefined> =>
    db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst(),
})
