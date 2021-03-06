import * as express from 'express'
import Automat from 'gent-core/lib/Automat'
import GrpcClient from 'gent-core/lib/GrpcClient'

const asyncHandler = (
  func: (req: express.Request, res: express.Response) => Promise<void> | void,
) => {
  return async (req, res, next) => Promise.resolve(func(req, res)).catch((e) => next(e))
}

export const createRouter = (automats: Automat[], client: GrpcClient) => {
  // setup router
  const router = express.Router()

  const getAutomat = (type: string) => {
    return automats.find((a) => a.process.attributes.type === type)
  }

  router.get(
    '/schema',
    asyncHandler(async (req, res) => {
      const type = req.query.type as string
      res.send(getAutomat(type).process.getSchema())
    }),
  )

  router.post(
    '/start',
    asyncHandler(async (req, res) => {
      const type = req.query.type as string
      const automat = getAutomat(type)
      const initial = await automat.startProcess(req.body)
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
