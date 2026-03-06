'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
          ? 'bg-white text-gray-900 p-8'
          : 'bg-[#0f0f0f] rounded-xl border border-border',
        className
      )}
      id="proposal-content"
    >
      {/* Header */}
      <div
        className={cn(
          'flex flex-col gap-1 border-b pb-4 mb-4',
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
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2
                className={cn(
                  'text-base font-semibold mt-5 mb-2 pb-2 border-b',
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
                  'text-sm font-semibold mt-3 mb-1.5',
                  printMode ? 'text-gray-800' : 'text-text-primary'
                )}
              >
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p
                className={cn(
                  'text-sm leading-snug mb-2',
                  printMode ? 'text-gray-700' : 'text-text-secondary'
                )}
              >
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul
                className={cn(
                  'flex flex-col gap-1 mb-3 ml-4',
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
                  'my-3',
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
            table: ({ children }) => (
              <table
                className={cn(
                  'w-full my-3 border-collapse text-sm',
                  printMode ? 'text-gray-700' : 'text-text-secondary'
                )}
              >
                {children}
              </table>
            ),
            thead: ({ children }) => <thead>{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => (
              <tr
                className={cn(
                  'border-b',
                  printMode ? 'border-gray-100' : 'border-border'
                )}
              >
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th
                className={cn(
                  'text-left py-1.5 pr-6 font-semibold align-top w-44 whitespace-nowrap',
                  printMode ? 'text-gray-900' : 'text-text-primary'
                )}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                className={cn(
                  'py-1.5 leading-snug align-top',
                  printMode ? 'text-gray-700' : 'text-text-secondary'
                )}
              >
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
