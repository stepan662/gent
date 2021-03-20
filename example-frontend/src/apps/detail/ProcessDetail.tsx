import React, { useEffect, useMemo, useState } from 'react'

import useSWR from 'swr'
import GentDiagram from 'gent-diagram'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import Stack from '@kiwicom/orbit-components/lib/Stack'
import Heading from '@kiwicom/orbit-components/lib/Heading'
import { ProcessStateType } from '../../../../gent-diagram/lib/types/ProcessState'
import { Schema } from '../../../../gent-diagram/lib/types/ProcessSchema'

const Container = styled.div`
  width: 1000px;
  margin: 0px auto;
  max-width: 100%;
  position: relative;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`

const Process = () => {
  const router = useRouter()

  const processId = router.query.processId as string

  const [observedIds, setObservedIds] = useState<string[]>()

  const addObservedIds = (ids: string[]) => {
    setObservedIds([...observedIds, ...ids])
  }

  useEffect(() => {
    if (processId) {
      setObservedIds([processId])
    }
  }, [processId])

  const { data: processStates } = useSWR<{ payload: ProcessStateType[] }>(
    observedIds && `/processes?ids=${observedIds.join(',')}`,
    {
      refreshInterval: 1000,
    },
  )

  const observedTypes = processStates?.payload.map((s) => s.type)

  const { data: processSchemas, revalidate: schemaRevalidate } = useSWR<{ payload: Schema[] }>(
    observedTypes && `/schemas?types=${observedTypes.join(',')}`,
    {
      refreshInterval: 10000,
    },
  )

  const cachedState = useMemo(() => {
    let states: typeof processStates = null
    let schemas: typeof processSchemas = null
    return (processStates, processSchemas) => {
      states = processStates || states
      schemas = processSchemas || schemas
      return {
        states,
        schemas,
      }
    }
  }, [processId])

  const { states, schemas } = cachedState(processStates, processSchemas)

  const state = states?.payload.find((s) => s.id === processId)
  const schema = schemas?.payload.find((s) => s.attributes.type === state?.type)

  const subs = states?.payload
    .map((state) => {
      const schema = schemas?.payload.find((s) => s.attributes.type === state.type)
      if (schema) {
        return { state, schema }
      }
    })
    .filter(Boolean)

  return (
    <Container>
      {schema && (
        <Stack>
          <Heading>{schema.attributes.name}</Heading>
          <GentDiagram
            schema={schema}
            state={state}
            subs={subs}
            onRequestSubprocess={addObservedIds}
            allowedLevel={3}
          />
        </Stack>
      )}

      {schema && state && <pre>{JSON.stringify(state, null, 2)}</pre>}

      {/* {proc?.status === 'error' && <ErrorVisualizer state={proc} />} */}

      {schemaRevalidate && !schema && <div>Loading</div>}
    </Container>
  )
}

export default Process
