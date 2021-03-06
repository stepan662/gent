import React, { useState } from 'react'

import Button from '@kiwicom/orbit-components/lib/Button'
import client from '../../client'
import { mutate } from 'swr'
import { useRouter } from 'next/router'

type Props = {
  type: string
  label: string
}

const NewProcessButton: React.FC<Props> = ({ type, label }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const createNewProcess = async () => {
    const bid = 'test' //  window.prompt('Insert booking id', '88491656')
    if (bid) {
      setLoading(true)
      try {
        const data = await client.post(`/start?type=${type}`)
        mutate(`/state?id=${data.id}`, data)
        router.push(`/process?processId=${data.id}`)
      } catch (e) {
        setLoading(false)
        console.error(e)
      }
    }
  }
  return (
    <Button loading={loading} onClick={createNewProcess}>
      {label}
    </Button>
  )
}

export default NewProcessButton
