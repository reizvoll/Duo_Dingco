import { Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'
import Loading from './Loading'

export default function ComponentWithBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  )
}
