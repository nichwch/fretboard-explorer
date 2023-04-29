// db.ts
import Dexie, { type Table } from 'dexie'
import type { FretMapBlockProps } from './types'

export interface PracticeSheet {
  id: string
  creation_date: Date
  name: string
  // TODO: type this
  sheetContents: FretMapBlockProps[]
}

export class Database extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  practice_sheets!: Table<PracticeSheet>

  constructor() {
    super('database')
    this.version(1).stores({
      practice_sheets: '++id, name, age, creation_date', // Primary key and indexed props
    })
  }
}

export const db = new Database()
