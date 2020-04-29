import {
  getByPath,
  updateByPath,
  mutateState,
  revertState,
  serialized,
  isPathValid,
  squashMutations,
  rewindMutations,
} from '../Journal'

describe('isPathValid', () => {
  let testObject
  let testArray

  beforeEach(() => {
    testObject = {
      first: {
        second: 'ok',
      },
      array: ['first', 'second'],
    }
    testArray = ['2']
  })

  it("doesn't fail on nonexistent fields on first level", () => {
    expect(() => isPathValid(testObject, 'first.nonexistent')).not.toThrowError()
  })

  it('fails on nonexistent array index', () => {
    expect(() => isPathValid(testObject, 'array.2')).toThrowError()
  })

  it('fails on nonexistent array string index', () => {
    expect(() => isPathValid(testObject, 'array.test')).toThrowError()
  })

  it('fails on nonexistent fields on second level', () => {
    expect(() => isPathValid(testObject, 'array.2.nonexistent')).toThrowError()
  })

  it('fails with non objects', () => {
    expect(() => isPathValid(testObject, 'first.second.0')).toThrowError()
  })

  it('fails when putting stuff on wrong index in array', () => {
    expect(() => isPathValid(testArray, '3')).toThrowError()
    expect(() => isPathValid(testArray, '-1')).toThrowError()
    expect(() => isPathValid(testArray, 'textIndex')).toThrowError()
    expect(() => isPathValid(testArray, 'NaN')).toThrowError()
  })
})

describe('getByPath', () => {
  let testObject

  beforeEach(() => {
    testObject = {
      first: {
        second: 'ok',
      },
      array: ['first', 'second'],
    }
  })

  it('gets correct data', () => {
    expect(getByPath(testObject, 'first.second')).toBe('ok')
    expect(getByPath(testObject, 'array.0')).toBe('first')
  })
})

describe('putByPath', () => {
  let testObject
  let testArray

  beforeEach(() => {
    testObject = {}
    testArray = ['2']
  })

  it('makes basic operations', () => {
    const resultObject = updateByPath(testObject, '1', '1')
    expect(resultObject).toEqual({ '1': '1' })

    const resultArray = updateByPath(testArray, '0', '1')
    expect(resultArray).toEqual(['1'])
  })
})

describe('update state', () => {
  let state: any
  beforeEach(() => {
    state = {
      tags: {},
      current: {
        state: { success: true },
      },
      testArray: ['first', 'second', 'third'],
    }
  })

  it('makes revertable changes 1', () => {
    const originalState = serialized(state)
    // make changes
    const [newState, mutation] = mutateState(state, { 'tags.state': 'finished' })
    expect(newState.tags).toEqual({ state: 'finished' })
    expect(mutation.prev_values).toEqual({ 'tags.state': { value: undefined } })

    expect(revertState(state, mutation)).toEqual(originalState)
  })

  it('makes revertable changes serialized "undefined"', () => {
    const originalState = serialized(state)
    // make changes
    const [newState, mutation] = serialized(mutateState(state, { 'current.state': undefined }))
    // revert changes
    const reverted = serialized(revertState(newState, mutation))
    expect(reverted).toEqual(originalState)
  })

  it('makes revertable changes serializable array', () => {
    const originalState = serialized(state)
    const [newState, mutation] = mutateState(state, { testArray: [] })
    const reverted = serialized(revertState(newState, mutation))
    expect(reverted).toEqual(originalState)
  })
})

describe('squashMutations', () => {
  let state: any
  beforeEach(() => {
    state = {
      a: {
        1: 'a',
        2: 'b',
      },
    }
  })

  it('does basic stuff', () => {
    const [newState, mutation] = mutateState(state, { 'a.b': 'd', 'a.c': 'e' })

    const squashedMutation = squashMutations(newState, [mutation])
    expect(squashedMutation.prev_values).toEqual(mutation.prev_values)
  })

  it('reverts in same way as multiple mutations', () => {
    const [newState, mutation] = mutateState(state, { 'a.1': 'test1', b: 'test2' })
    const [newState1, mutation1] = mutateState(newState, { 'a.1': 'test3', 'a.2': 'test4' })
    const [newState2, mutation2] = mutateState(newState1, { a: 'test5', b: 'test6' })

    const squashedMutation = squashMutations(newState2, [mutation, mutation1, mutation2])

    expect(rewindMutations(newState2, [mutation, mutation1, mutation2])).toEqual(
      rewindMutations(newState2, [squashedMutation]),
    )
  })
})
