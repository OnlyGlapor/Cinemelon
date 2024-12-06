import React, { Suspense } from 'react'
import RecommendationsPageContent from './component/RecommendationsPageContent'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecommendationsPageContent />
    </Suspense>
  )
}

export default page