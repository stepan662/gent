import Automat from '../Automat'
import { ProcessStateType } from '../Types'
import processBasic from './processBasic'

const simulateBEStep = (state: ProcessStateType): ProcessStateType => {
  console.log(state)
  switch (state.status) {
    case 'error': {
      console.log('Process error')
      return null
    }
    case 'finished': {
      console.log('Process finished')
      return null
    }
    case 'running': {
      return {
        ...state,
        currentTask: state.nextTask,
        currentSubtask: state.nextSubtask,
        nextTask: null,
        nextSubtask: null,
        nextDeployTime: null,
      }
    }
  }
}

describe('Automat', () => {
  it('is able to go through basic process', async () => {
    const automat = new Automat(processBasic)

    let result = await automat.startProcess('hello', 'test', 'test')
    let beResponse: ProcessStateType

    while ((beResponse = simulateBEStep(result))) {
      result = await automat.step(beResponse)
    }
  })
})
