import { getBasicConfig } from '../../helpers/args/config'
import output from '../../helpers/output'

export async function handler (args) {
  const value = await getBasicConfig(args, args.key)
  output.space(args)
  output.accent(value, args)
  output.space(args)
}

export default {
  command: 'get <key>',
  desc: 'Get config for CLI',
  handler,
}
