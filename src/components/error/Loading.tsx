import Image from 'next/image'

// components/Loader.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl text-gray-600">Loading중!!!!!</p>
      <div>
        <Image src="/error.png" alt="Error" width={300} height={300} priority />
      </div>
    </div>
  )
}
