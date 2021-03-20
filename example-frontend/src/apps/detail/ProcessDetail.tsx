import React from 'react'

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

  const { processId } = router.query

  const { data: state } = useSWR<ProcessStateType>(processId && `/state?id=${processId}`, {
    refreshInterval: 1000,
  })
  const { data: schema, revalidate: schemaRevalidate } = useSWR<Schema>(
    state && `/schema?type=${state.type}`,
    {
      refreshInterval: 10000,
    },
  )

  const { data: subSchemas } = useSWR<Schema[]>(
    state?.subProcesses?.map((sub) => `/schema?type=${sub.type}`),
  )
  const { data: subStates } = useSWR<ProcessStateType[]>(
    state?.subProcesses?.map((sub) => `/state?id=${sub.id}`),
    { refreshInterval: 1000 },
  )

  const subs = subStates
    ?.map((state) => {
      const schema = subSchemas?.find((s) => s.attributes.type === state.type)
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
          <GentDiagram schema={schema} state={state} subs={subs} />
        </Stack>
      )}

      {schema && state && <pre>{JSON.stringify(state, null, 2)}</pre>}

      {/* {proc?.status === 'error' && <ErrorVisualizer state={proc} />} */}

      {schemaRevalidate && !schema && <div>Loading</div>}
    </Container>
  )
}

export default Process
