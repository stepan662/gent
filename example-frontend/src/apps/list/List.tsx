import React from 'react'

import NewProcessButton from './NewProcessButton'
import ProcessOverview from './Process'
import useSWR from 'swr'
import styled from 'styled-components'

const Container = styled.div`
  width: 1000px;
  margin: 0px auto;
  max-width: 100%;
`

const Wrapper = styled.div`
  padding: 20px;
`

const List = () => {
  const { data } = useSWR('/processes?limit=100', { refreshInterval: 5000 })

  return (
    <Container>
      <Wrapper>
        <NewProcessButton />

        <h2>Processes: </h2>
        {data && data.payload.map((process) => <ProcessOverview key={process.id} data={process} />)}
      </Wrapper>
    </Container>
  )
}

export default List
