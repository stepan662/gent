import Automat from '../Automat'
import processBasic from './processBasic'
import GrpcClient from '../tools/GrpcClient'
import { ProcessStateType } from '../Types'

async function main() {
  const automat = new Automat(processBasic)
  let initProcess = await automat.startProcess('hello', 'test', 'test')

  const client = new GrpcClient()

  const onMessage = async (data: ProcessStateType) => {
    const result = await automat.step(data)
    console.log(result)
    await client.processStepResult(result)
  }

  client.startWorker(onMessage, 'test', 'test')
  const initialized = await client.createProcess(initProcess)
  console.log(initialized)
}

main()
