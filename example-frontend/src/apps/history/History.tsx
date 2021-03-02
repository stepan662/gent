import React, { useState, useCallback } from 'react'

import useSWR from 'swr'
import GentDiagram from 'gent-diagram'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Slider from '@kiwicom/orbit-components/lib/Slider'

import ErrorVisualizer from '../../components/ErrorVisualizer'

const Container = styled.div`
  width: 1000px;
  margin: 0px auto;
  max-width: 100%;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StateWrapper = styled.pre``

const State = styled.div`
  display: flex;
  & > * + * {
    margin-left: 10px;
  }
`

const Item = styled.div`
  min-width: 100px;
  font-size: 14px;
`

const Process = () => {
  const router = useRouter()

  const [historyIndex, setHistoryIndex] = useState(0)

  const { processId } = router.query

  const { data: schema, revalidate: schemaRevalidate } = useSWR('/schema')
  const { data: history }: { data?: any[] } = useSWR(processId && `/journal?id=${processId}`)

  const handleSliderChange = useCallback(
    (sliderIndex) => {
      setHistoryIndex(history.length - sliderIndex)
    },
    [history],
  )

  return (
    <Container>
      {schema && history && (
        <Wrapper>
          <GentDiagram schema={schema} state={history[historyIndex]?.state} />
          <Slider
            minValue={1}
            maxValue={history.length}
            step={1}
            defaultValue={history.length - historyIndex}
            onChange={handleSliderChange}
          />
          <State>
            <Item>{new Date(history[historyIndex]?.timestamp).toLocaleTimeString()}</Item>
            <Item>{history[historyIndex]?.message}</Item>
          </State>
          <StateWrapper>{JSON.stringify(history[historyIndex]?.state, null, 2)}</StateWrapper>
        </Wrapper>
      )}

      {/* {process?.status === 'error' && <ErrorVisualizer state={process} />} */}

      {schemaRevalidate && !schema && <div>Loading</div>}
    </Container>
  )
}

export default Process
