'use client'

import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface ProposalPreviewProps {
  content: string
  clientName?: string
  className?: string
  printMode?: boolean
}

export function ProposalPreview({
  content,
  clientName,
  className,
  printMode = false,
}: ProposalPreviewProps) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className={cn(
        'flex flex-col',
        printMode
          ? 'bg-white text-gray-900 p-12'
          : 'bg-[#0f0f0f] rounded-xl border border-border',
        className
      )}
      id="proposal-content"
    >
      {/* Header */}
      <div
        className={cn(
          'flex flex-col gap-1 border-b pb-6 mb-6',
          printMode ? 'border-gray-200' : 'border-border p-8'
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <p
              className={cn(
                'text-xs font-semibold uppercase tracking-widest mb-2',
                printMode ? 'text-indigo-600' : 'text-accent'
              )}
            >
              Business Proposal
            </p>
            <h1
              className={cn(
                'text-2xl font-bold tracking-tight',
                printMode ? 'text-gray-900' : 'text-text-primary'
              )}
            >
              {clientName ? `Prepared for ${clientName}` : 'Client Proposal'}
            </h1>
            <p className={cn('text-sm mt-1', printMode ? 'text-gray-500' : 'text-text-muted')}>
              {today}
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div
        className={cn(
          'proposal-body flex-1',
          printMode ? 'px-0' : 'px-8 pb-8'
        )}
      >
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2
                className={cn(
                  'text-base font-semibold mt-8 mb-3 pb-2 border-b',
                  printMode
                    ? 'text-gray-900 border-gray-200 text-indigo-900'
                    : 'text-text-primary border-border'
                )}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                className={cn(
                  'text-sm font-semibold mt-5 mb-2',
                  printMode ? 'text-gray-800' : 'text-text-primary'
                )}
              >
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p
                className={cn(
                  'text-sm leading-relaxed mb-3',
                  printMode ? 'text-gray-700' : 'text-text-secondary'
                )}
              >
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul
                className={cn(
                  'flex flex-col gap-1.5 mb-4 ml-4',
                  printMode ? 'text-gray-700' : 'text-text-secondary'
                )}
              >
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li
                className={cn(
                  'flex gap-2 text-sm leading-relaxed',
                  printMode ? 'text-gray-700' : 'text-text-secondary'
                )}
              >
                <span
                  className={cn(
                    'mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full',
                    printMode ? 'bg-indigo-500' : 'bg-accent'
                  )}
                />
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong
                className={cn(
                  'font-semibold',
                  printMode ? 'text-gray-900' : 'text-text-primary'
                )}
              >
                {children}
              </strong>
            ),
            hr: () => (
              <hr
                className={cn(
                  'my-6',
                  printMode ? 'border-gray-200' : 'border-border'
                )}
              />
            ),
            em: ({ children }) => (
              <em
                className={cn(
                  'text-xs not-italic',
                  printMode ? 'text-gray-400' : 'text-text-muted'
                )}
              >
                {children}
              </em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
