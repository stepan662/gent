import * as express from 'express'
import Automat from 'gent-core/lib/Automat'
import GrpcClient from 'gent-core/lib/GrpcClient'

const asyncHandler = (
  func: (req: express.Request, res: express.Response) => Promise<void> | void,
) => {
  return async (req, res, next) => Promise.resolve(func(req, res)).catch((e) => next(e))
}

export const createRouter = (worker: Automat, client: GrpcClient) => {
  // setup router
  const router = express.Router()

  router.get(
    '/schema',
    asyncHandler(async (req, res) => {
      res.send(worker.process.getSchema())
    }),
  )

  router.post(
    '/start',
    asyncHandler(async (req, res) => {
      const initial = await worker.startProcess(req.body, 'test', 'test')
      const result = await client.createProcess(initial)
      res.send(result)
    }),
  )

  router.get(
    '/state',
    asyncHandler(async (req, res) => {
      const id = req.query.id as string
      const state = await client.getProcess(id)
      res.send(state)
    }),
  )

  router.get(
    '/processes',
    asyncHandler(async (req, res) => {
      const processes = await client.getProcesses()
      res.send({
        payload: processes,
      })
    }),
  )

  router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      console.log(r.route.path)
    }
  })
  return router
}
