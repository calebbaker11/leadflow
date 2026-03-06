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
      <AutoPrint />
      <ProposalPreview
        content={proposal.generated_proposal_text}
        clientName={proposal.client_name}
        printMode
      />
    </>
  )
}
