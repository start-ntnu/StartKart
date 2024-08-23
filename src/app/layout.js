import './globals.css'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mario Kart',
  description: 'Start NTNU mario kart toppliste',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{padding: 0, margin: 0}} className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  )
}
