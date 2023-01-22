import { Client } from 'pg'

const createTableText = `
CREATE TABLE IF NOT EXISTS WORD (
  saados_id UUID NOT NULL,
  word TEXT,

  CONSTRAINT fk_saados_id
  FOREIGN KEY(saados_id)
  REFERENCES saados(id)
  ON DELETE CASCADE,

  PRIMARY KEY (saados_id, word)
);

CREATE INDEX idx_word_word ON word(word);
`

export const createWordTable = (db: Client) => db.query(createTableText)

export const insertWord = async (
  db: Client,
  saadosId: string,
  words: string[]
) => {
  const insertStatement = `INSERT INTO WORD (saados_id, word) VALUES ${words
    .map((word, i) => `('${saadosId}', $${i + 1})`)
    .join(', ')}`
  db.query(insertStatement, words)
}

export const findLawsByWords = async (db: Client, words: string[]) => {
  const joins = words
    .map(
      (_w: string, i: number) => `
                          inner join word w${i}
                          on s.id = w${i}.saados_id
                          `
    )
    .join(' ')
  const likes = words
    .map(
      (_w: string, i: number) => `
                          w${i}.word LIKE $${i + 1}
                          `
    )
    .join(' AND ')
  const sql = `
  SELECT DISTINCT s.vuosi, s.asiakirjanumero
  FROM saados s
  ${joins}
  WHERE
  ${likes}`
  const res = await db.query(sql, words)
  return res.rows
}
