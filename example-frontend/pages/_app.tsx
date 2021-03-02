import React from 'react'

import { SWRConfig, ConfigInterface } from 'swr'
import styled, { ThemeProvider } from 'styled-components'
import { getTokens } from '@kiwicom/orbit-design-tokens'

import client from '../src/client'

const swrConfig: ConfigInterface = {
  fetcher: async (url, ...args) => {
    return await client(url, ...args)
  },
  refreshInterval: 0,
  revalidateOnFocus: true,
  revalidateOnReconnect: false,
  dedupingInterval: 1,
}

const Wrapper = styled.div`
  margin: 0;
  font-family: 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={{ orbit: getTokens() }}>
      <SWRConfig value={swrConfig}>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </SWRConfig>
    </ThemeProvider>
  )
}

export default App
