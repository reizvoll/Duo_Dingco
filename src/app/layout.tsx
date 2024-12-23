import type { Metadata } from 'next'
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: 'Duo-Dingco',
  description: 'Generated by create next app',
  icons: {
    icon: "/dingco.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
