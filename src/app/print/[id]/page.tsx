import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProposalPreview } from '@/components/proposals/proposal-preview'
import { AutoPrint } from './auto-print'

export default async function PrintProposalPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!proposal || !proposal.generated_proposal_text) redirect('/proposals')

  return (
    <>
      <style>{`
        @page {
          size: A4 portrait;
          margin: 1.4cm 1.8cm;
        }

        /* Headings must stay attached to the content that follows them */
        h2, h3 {
          break-after: avoid;
          page-break-after: avoid;
        }

        /* The element immediately after a heading can't be orphaned on a new page */
        h2 + p, h2 + ul, h2 + ol, h2 + table,
        h3 + p, h3 + ul, h3 + ol, h3 + table {
          break-before: avoid;
          page-break-before: avoid;
        }

        /* Never split a paragraph, list, or table mid-element — move the whole thing to next page */
        p, ul, ol, table {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        li {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      `}</style>
      <AutoPrint />
      <ProposalPreview
        content={proposal.generated_proposal_text}
        clientName={proposal.client_name}
        printMode
      />
    </>
  )
}
