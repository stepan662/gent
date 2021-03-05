import Process from './models/Process'

async function sync() {
  await Process.sync({ alter: true })
}

sync()
