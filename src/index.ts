/* eslint-disable @typescript-eslint/no-explicit-any */

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import preprocess from './cmd/preprocess'
import findLaw from './cmd/findLaw'

yargs(hideBin(process.argv))
  .command('preprocess', 'Init the database.', async () => {
    await preprocess()
    process.exit(0)
  })
  .command(
    'find [words..]',
    'Find the laws that contain the given words.',
    // eslint-disable-next-line no-shadow
    (yargs: any) => {
      yargs
        .positional('words', {
          type: 'string',
          describe: 'Words to search for.',
        })
        .options({
          nonpretty: {
            description: 'Disable pretty print.',
            type: 'boolean',
          },
        })
    },
    async (argv: any) => {
      const { nonpretty } = argv
      const laws = await findLaw(
        argv.words.map((word: string) => word.toUpperCase())
      )
      if (!nonpretty) {
        const outStr = JSON.stringify(laws, null, 2)
        console.log(outStr)
      } else {
        const outStr = JSON.stringify(laws)
        console.log(outStr)
      }
      process.exit(0)
    }
  )
  .parse()
