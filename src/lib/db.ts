// db.ts
import Dexie, { type Table, type Transaction } from 'dexie'
import type { FretMapBlockProps } from './types'
import {
  AUTUMN_LEAVES,
  BASIC_SCALE_PRACTICE,
  COMPARING_SCALES,
} from './sample_practice_sheets'
import { nanoid } from 'nanoid'

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
      practice_sheets: '++id, name, creation_date', // Primary key and indexed props
    })
  }
}

export const db = new Database()

db.on('populate', (tx: Transaction) => {
  // Use provided transaction to populate database with initial data
  // tx.table('users').add({id: "me", name: "Me"});
  tx.table('practice_sheets').add(COMPARING_SCALES)
  tx.table('practice_sheets').add(AUTUMN_LEAVES)
  tx.table('practice_sheets').add(BASIC_SCALE_PRACTICE)
})
