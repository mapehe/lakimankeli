import { Client } from 'pg'
import { findLawsByWords } from '../lib/db/table/word'

const filterByWords = async (db: Client, words: string[]) => {
  const rows = await findLawsByWords(db, words)
  return rows.map((row) => `${row.asiakirjanumero}/${row.vuosi}`)
}

const findLaw = async (words: string[]) => {
  const db = new Client()
  await db.connect()
  const laws = await filterByWords(db, words)
  await db.end()
  return laws
}

export default findLaw
