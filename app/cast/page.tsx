import React, { Suspense } from 'react'
import CastProfilePageContent from './components/CastProfilePageContent'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CastProfilePageContent />
    </Suspense>
  )
}

export default page