import { Client } from 'pg'

const createTableText = `
CREATE TABLE IF NOT EXISTS SAADOS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vuosi TEXT,
  asiakirjanumero TEXT,
  data XML NOT NULL,

  CHECK(data IS DOCUMENT)
);
`

const migrateVuosiAsiakirjanumero = `
UPDATE SAADOS
SET vuosi = CAST((SELECT (xpath('//*[local-name()=''ValtiopaivavuosiTeksti'']/text()', data))[1]) AS TEXT),
    asiakirjanumero = CAST((SELECT (xpath('//*[local-name()=''AsiakirjaNroTeksti'']/text()', data))[1]) AS TEXT);
`

const removeNonNumericVuosiAsiakirjanumero = `
UPDATE SAADOS SET
VUOSI=regexp_replace(VUOSI, '[^0-9]+', '', 'g'),
ASIAKIRJANUMERO=regexp_replace(ASIAKIRJANUMERO, '[^0-9]+', '', 'g');
`

export const createSaadosTable = (db: Client) => db.query(createTableText)

export const insertSaados = async (db: Client, xml: string | Buffer) => {
  const result: any = await db.query(
    'INSERT INTO SAADOS (data) VALUES ($1) RETURNING id',
    [xml]
  )
  return result.rows[0].id
}

export const addVuosiAsiakirjanumero = async (db: Client) => {
  await db.query(migrateVuosiAsiakirjanumero)
  await db.query(removeNonNumericVuosiAsiakirjanumero)
}
