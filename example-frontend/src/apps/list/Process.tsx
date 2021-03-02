import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const StyledLink = styled.a`
  display: flex;
  border-bottom: 1px solid lightgray;
  padding: 3px;
  margin: 5px;
`

const ProcessId = styled.div`
  display: flex;
  font-size: 14px;
  flex-basis: 400px;
`

const ProcessStatus = styled.div`
  display: flex;
  font-size: 13px;
  flex-basis: 200px;
`

function actionToState(action) {
  return action
}

const ProcessOverview = ({ data }) => {
  return (
    <div>
      <Link href={`/process?processId=${data.id}`} passHref>
        <StyledLink>
          <ProcessId>Id: {data.id}</ProcessId>
          <ProcessStatus>{actionToState(data.status)}</ProcessStatus>
        </StyledLink>
      </Link>
    </div>
  )
}

export default ProcessOverview
