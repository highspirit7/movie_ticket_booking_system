/* eslint-disable no-console */
import * as path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)

function sanitizeISOString(isoString: string) {
  return isoString.substring(0, isoString.length - 4).replace(/\D/g, '')
}

function createMigrationFile(name: string) {
  const isoString = new Date().toISOString()

  const filename = `${sanitizeISOString(isoString)}-${name}.ts`
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const filePath = path.join(dirname, 'migrations', filename)

  const template = `/**
   * Migration: ${filename}
   */
    import { Kysely } from 'kysely'

    export async function up(db: Kysely<any>): Promise<void> {
    // TODO: Write migration code here
  };
  

  `
  try {
    fs.writeFile(filePath, template)
    console.log('File written successfully')
  } catch (error) {
    console.error('Error writing file:', error)
  }
}

// Usage example
// const migrationName = 'add_users_table'
createMigrationFile(args[0])
