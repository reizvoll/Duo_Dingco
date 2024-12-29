'use client'

import Image from 'next/image'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled Error:', error)
  }, [error])
  return (
    <html>
      <body>
        <h2 className="text-2xl font-bold text-gray-700 mt-4">
          Something went wrong!
        </h2>
        <div>
          <Image
            src="/error.png"
            alt="Error"
            width={300}
            height={300}
            priority
          />
        </div>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
