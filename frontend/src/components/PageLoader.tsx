import { LoaderIcon } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className='flex items-center justify-center'>
        <LoaderIcon className='size-10 animate-spin'/>
    </div>
  )
}

export default PageLoader