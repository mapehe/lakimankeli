/* eslint-disable no-await-in-loop */
import glob from 'glob'
import fs from 'fs'
import cliProgress from 'cli-progress'
import colors from 'ansi-colors'
import { Client } from 'pg'
import initDB from '../lib/db/init'
import { addVuosiAsiakirjanumero, insertSaados } from '../lib/db/table/saados'
import { insertWord } from '../lib/db/table/word'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const textVersion = require('textversionjs')

const processFile = async (db: Client, filename: string) => {
  const xml = fs.readFileSync(filename)
  try {
    const saadosId = await insertSaados(db, xml)
    const words: any[] = [
      ...new Set(
        textVersion(xml)
          .split(' ')
          .map((x: string) => x.toUpperCase())
      ),
    ]
    await insertWord(db, saadosId, words)
  } catch (e) {
    console.log(`\nError in processing ${filename}.`)
    console.log(e)
  }
}

const preprocess = async () => {
  const db = new Client()
  await db.connect()

  await initDB(db)
  const files = glob.sync('data/asd/**/*.xml')
  const bar = new cliProgress.SingleBar(
    {
      format: `Preprocessing statures |${colors.cyan(
        '{bar}'
      )}| {percentage}% | {value}/{total} Files processed`,
    },
    cliProgress.Presets.shades_classic
  )
  bar.start(files.length, 0)
  for (const file of files) {
    await processFile(db, file)
    bar.increment()
  }
  bar.stop()

  console.log('Postprocessing entries. This will take a couple of minutes...')
  await addVuosiAsiakirjanumero(db)
  await db.end()
}

export default preprocess
