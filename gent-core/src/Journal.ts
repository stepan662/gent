import { ProcessStateType, JournalMutationType, MutationType } from './Types'

export const serialized = (data) => (data ? JSON.parse(JSON.stringify(data)) : data)

// valid path can touch undefined fields on objects
// but not on arrays, because if we place something there, we change the length of an array
// in ambiguous way
// indexes into array also must be valid numbers
export const isPathValid = (state: any, path: string) => {
  path.split('.').reduce((object, key) => {
    if (typeof object !== 'object') {
      throw new Error(`INVALID_PATH: Cannot use index '${key}' on type '${typeof object}'`)
    } else if (Array.isArray(object)) {
      const index = Number(key)
      if (!Number.isInteger(index) || 0 > index || object.length <= index) {
        throw new Error(
          `INVALID_PATH: Cannot use index '${key}' on array of length '${object.length}'`,
        )
      }
    }
    return object[key]
  }, state)
}

export const getByPath = (object: any, path: string) => {
  return path.split('.').reduce((o, i) => o[i], object)
}

export const updateByPath = (object: any, path: string, data: any) => {
  const [firstPart, ...pathRest] = path.split('.')
  let result
  if (Array.isArray(object)) {
    result = [...object]
    result[Number(firstPart)] = pathRest.length
      ? updateByPath(object[firstPart], pathRest.join('.'), data)
      : data
  } else {
    result = {
      ...object,
      [firstPart]: pathRest.length
        ? updateByPath(object[firstPart], pathRest.join('.'), data)
        : data,
    }
  }
  return result
}

export const createJournalMutation = (
  prevValuesInput: MutationType,
  message: string = null,
): JournalMutationType => {
  let prevValues = {}

  // needs to be nested for serialization
  for (const [path, value] of Object.entries(prevValuesInput)) {
    prevValues[path] = { value }
  }

  return {
    process_id: null,
    timestamp: Date.now(),
    prev_values: prevValues,
    message,
  }
}

// there can't be two paths with same prefix in one mutation
// e.g. 'a.b' and 'a'
// it's not clear, which should be done first, and it would have different results
const checkValidChanges = (changes: MutationType) => {
  const paths = Object.keys(changes)
  for (const path of paths) {
    const duplicit = paths.find((p) => path != p && path.startsWith(p))
    if (duplicit) {
      throw new Error(`CHANGE_ERROR: duplicit paths: '${path}' and '${duplicit}'`)
    }
  }
}

export const mutateState = (
  state: ProcessStateType,
  changes: MutationType,
): [ProcessStateType, JournalMutationType] => {
  checkValidChanges(changes)
  let prevValues = {}
  let newState = state
  for (const [path, value] of Object.entries(changes)) {
    isPathValid(newState, path)
    prevValues[path] = getByPath(newState, path)
    newState = updateByPath(newState, path, value)
  }
  return [newState, createJournalMutation(prevValues)]
}

export const revertState = (state: ProcessStateType, mutation: JournalMutationType) => {
  let newState = state
  for (const [path, value] of Object.entries(mutation.prev_values)) {
    newState = updateByPath(newState, path, value.value)
  }
  return newState
}

export const rewindMutations = (state: ProcessStateType, mutations: JournalMutationType[]) => {
  let result = state
  const reversedMutations = [...mutations].reverse()
  reversedMutations.forEach((mutation) => {
    result = revertState(result, mutation)
  })
  return serialized(result)
}

// keeps only shortest paths and dedupliactes them
// while squashing mutations
const updateRootPaths = (rootPaths: string[], path: string) => {
  let result = []
  for (const includedPath of rootPaths) {
    if (path.startsWith(includedPath)) {
      // path is already inluded or there is shorter path
      // no need to change anything
      return rootPaths
    }
    if (includedPath.startsWith(path)) {
      // new path replaces this one
      // so don't include it
      continue
    }
    result.push(includedPath)
  }

  // path is not included or is new shortest
  result.push(path)
  return result
}

// we find all shortest paths (places that were changed) with previous values from original state
// that way we squash all mutations into one
export const squashMutations = (finalState: ProcessStateType, mutations: JournalMutationType[]) => {
  // get state before all mutations happened
  const originalState = rewindMutations(finalState, mutations)
  let rootChangesPaths = []

  for (const mutation of mutations) {
    for (const path of Object.keys(mutation.prev_values)) {
      // filter paths, which are duplicated or have same prefix
      rootChangesPaths = updateRootPaths(rootChangesPaths, path)
    }
  }

  const newChanges: MutationType = {}
  for (const changedPath of rootChangesPaths) {
    // to filtered paths add old state
    newChanges[changedPath] = getByPath(originalState, changedPath)
  }

  return createJournalMutation(newChanges)
}
