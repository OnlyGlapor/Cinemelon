import React, { Suspense } from 'react'
import MovieDetailsPageContent from './components/MovieDetailsPageContent'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MovieDetailsPageContent />
    </Suspense>
  )
}

export default page