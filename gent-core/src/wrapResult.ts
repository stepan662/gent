import { SubtaskResult } from './Subtask'

export const wrapResult = (rawResult: SubtaskResult | any): SubtaskResult => {
  if (rawResult instanceof SubtaskResult) {
    return rawResult
  } else {
    return new SubtaskResult({ returnData: rawResult })
  }
}
