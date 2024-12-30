'use client'

import Image from 'next/image'
// 에러 바운더리
import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p>Error occurred: {this.state.error?.message}</p>
          <div>
            <Image
              src="/error.png"
              alt="Error"
              width={300}
              height={300}
              priority
            />
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
