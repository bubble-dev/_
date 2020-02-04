import { resolve } from 'path'

type TStartOptions = {
  file?: string,
  preset?: string,
  reporter?: string,
  require?: (string | [string, { [k: string]: any }])[],
}

const getTasksNames = (tasks: any, namespace?: string, tasksNames: string[] = []) => {
  for (const [taskName, task] of Object.entries(tasks)) {
    const path = `${namespace === undefined ? '' : `${namespace}.`}${taskName}`

    if (typeof task === 'function') {
      tasksNames.push(path)
    }

    getTasksNames(task, path, tasksNames)
  }

  return tasksNames
}

export default async (argv: string[], options: TStartOptions) => {
  if (!options.reporter) {
    throw '`reporter` option is missing in your `package.json` → `start`'
  }

  const tasksFile = options.file || './tasks'
  const tasksToRequire = options.preset || resolve(tasksFile)
  const tasks = await import(tasksToRequire)
  const taskName = argv[2]
  const task = taskName?.split('.').reduce((tasks, taskName) =>
    tasks && Object.prototype.hasOwnProperty.call(tasks, taskName) && tasks[taskName]
  , tasks)

  if (typeof task !== 'function') {
    throw `One of the following task names is required:\n* ${getTasksNames(tasks).join('\n* ')}`
  }

  const taskArgs = argv.slice(3)
  const taskRunner = await task(...taskArgs)
  const { default: reporter } = await import(options.reporter)

  return taskRunner(reporter(taskName))()
}
