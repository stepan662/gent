import * as path from 'path'
import * as express from 'express'
import * as cors from 'cors'

import GentAutomat from 'gent-core/lib/Automat'

import { createRouter } from './expressRouter'
import process1 from './process1'
import process2 from './process2'
import process3 from './process3'
import process4 from './process4'
import GrpcClient from 'gent-core/lib/GrpcClient'
import { ProcessStateType } from 'gent-core/lib/Types'

const automat1 = new GentAutomat(process1, true)
const automat2 = new GentAutomat(process2, true)
const automat3 = new GentAutomat(process3, true)
const automat4 = new GentAutomat(process4, true)
const automats = [automat1, automat2, automat3, automat4]
const client = new GrpcClient()
const gentRouter = createRouter(automats, client)
const getAutomat = (type: string) => {
  return automats.find((a) => a.process.attributes.type === type)
}

const onMessage = async (data: ProcessStateType) => {
  const automat = getAutomat(data.type)
  const result = await automat.step(data)
  await client.processStepResult(result)
}

client.startWorker(
  onMessage,
  automats.map((a) => ({
    type: a.process.attributes.type,
    version: a.process.attributes.version,
  })),
)

const app = express()
app.use(cors())
app.use(express.json())
app.use(gentRouter)
app.listen(8080, () => {
  console.log('Server running on port 8080')
})
