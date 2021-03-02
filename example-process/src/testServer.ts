import * as dotenv from 'dotenv'
dotenv.config()

import * as path from 'path'
import * as express from 'express'
import * as cors from 'cors'
import * as swaggerUi from 'swagger-ui-express'
import * as yaml from 'yamljs'

import GentAutomat from 'gent-core/lib/Automat'

import { OpenApiValidator } from 'express-openapi-validator'
import { createRouter } from './expressRouter'
import simpleProcess from './simpleProcess'
import GrpcClient from 'gent-core/lib/GrpcClient'
import { ProcessStateType } from 'gent-core/lib/Types'

const swaggerDocument = yaml.load(path.join(__dirname, '../schema.yaml'))

const automat = new GentAutomat(simpleProcess, true)
const client = new GrpcClient()
const gentRouter = createRouter(automat, client)

const app = express()

app.use('/ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors())

app.use(express.json())

new OpenApiValidator({
  apiSpec: path.join(__dirname, '../schema.yaml'),
  validateRequests: true,
  validateResponses: false,
})
  .install(app)
  .then(() => {
    const onMessage = async (data: ProcessStateType) => {
      const result = await automat.step(data)
      await client.processStepResult(result)
    }

    client.startWorker(onMessage, 'test', 'test')

    app.use(gentRouter)

    app.listen(8080, () => {
      console.log('Server running on port 8080')
    })
  })
