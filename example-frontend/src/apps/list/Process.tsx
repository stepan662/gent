import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Stack from '@kiwicom/orbit-components/lib/Stack'

const StyledLink = styled.a`
  display: flex;
  border-bottom: 1px solid lightgray;
  padding: 3px;
  margin: 5px;
`

const RowItem = styled.div`
  display: flex;
  font-size: 14px;
`

function actionToState(action) {
  return action
}

const ProcessOverview = ({ data }) => {
  return (
    <div>
      <Link href={`/process?processId=${data.id}`} passHref>
        <StyledLink>
          <Stack direction="row" justify="between">
            <RowItem>Id: {data.id}</RowItem>
            <RowItem>type: {data.type}</RowItem>
            <RowItem>{actionToState(data.status)}</RowItem>
          </Stack>
        </StyledLink>
      </Link>
    </div>
  )
}

export default ProcessOverview
