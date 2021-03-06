import React from 'react'

import useSWR from 'swr'
import GentDiagram from 'gent-diagram'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import Stack from '@kiwicom/orbit-components/lib/Stack'
import Heading from '@kiwicom/orbit-components/lib/Heading'

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

  const { data: state } = useSWR(processId && `/state?id=${processId}`, {
    refreshInterval: 1000,
  })

  const { data: schema, revalidate: schemaRevalidate } = useSWR(
    state && `/schema?type=${state.type}`,
    {
      refreshInterval: 10000,
    },
  )

  return (
    <Container>
      {schema && (
        <Stack>
          <Heading>{schema.attributes.name}</Heading>
          <GentDiagram schema={schema} state={state} />
        </Stack>
      )}

      {schema && state && <pre>{JSON.stringify(state, null, 2)}</pre>}

      {/* {proc?.status === 'error' && <ErrorVisualizer state={proc} />} */}

      {schemaRevalidate && !schema && <div>Loading</div>}
    </Container>
  )
}

export default Process
