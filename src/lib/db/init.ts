import { Client } from 'pg'
import { createSaadosTable } from './table/saados'
import { createWordTable } from './table/word'

const initDB = async (db: Client) => {
  await createSaadosTable(db)
  await createWordTable(db)
}

export default initDB
