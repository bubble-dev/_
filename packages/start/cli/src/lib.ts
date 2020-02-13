import { resolve } from 'path'

type TStartOptions = {
  file?: string,
  preset?: string,
  reporter?: string,
  require?: (string | [string, { [k: string]: any }])[],
}

export default async (argv: string[], options: TStartOptions) => {
  if (!options.reporter) {
    throw '`reporter` option is missing in your `package.json` → `start`'
  }

  const tasksFile = options.file || './tasks'
  const tasksToRequire = options.preset || resolve(tasksFile)
  const tasks = await import(tasksToRequire)
  const taskName = argv[2]
  const task = tasks[taskName]

  if (typeof taskName === 'undefined' || typeof task === 'undefined') {
    throw `One of the following task names is required:\n* ${Object.keys(tasks).join('\n* ')}`
  }

  const taskArgs = argv.slice(3)
  const taskRunner = await task(...taskArgs)
  const { default: reporter } = await import(options.reporter)

  return taskRunner(reporter(taskName))()
}
