export interface Profile {
  id: string
  email: string
  full_name: string | null
  stripe_customer_id: string | null
  subscription_status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing'
  created_at: string
  updated_at: string
}

export type TemplateType = 'freelancer' | 'agency' | 'contractor' | 'consultant'
export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'declined'

export interface Proposal {
  id: string
  user_id: string
  client_name: string
  business_type: string | null
  template_type: TemplateType
  scope: string | null
  price: string | null
  timeline: string | null
  additional_notes: string | null
  generated_proposal_text: string | null
  share_token: string
  is_shared: boolean
  status: ProposalStatus
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string | null
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface ProposalFormData {
  client_name: string
  business_type: string
  template_type: TemplateType
  scope: string
  price: string
  timeline: string
  additional_notes: string
}

export interface Template {
  id: TemplateType
  name: string
  description: string
  icon: string
  example_scope: string
  example_timeline: string
}

export interface DashboardStats {
  total_proposals: number
  sent_proposals: number
  accepted_proposals: number
  revenue_opportunity: string
}
