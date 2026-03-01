import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'LeadFlow — AI Proposal Builder',
    template: '%s | LeadFlow',
  },
  description:
    'Generate professional business proposals in minutes. Close more deals with AI-powered proposals built for service businesses.',
  keywords: ['proposal builder', 'AI proposals', 'business proposals', 'close more deals'],
  openGraph: {
    title: 'LeadFlow — AI Proposal Builder',
    description: 'Generate professional business proposals in minutes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#161616',
              border: '1px solid #222222',
              color: '#f8f8f8',
            },
          }}
        />
      </body>
    </html>
  )
}
