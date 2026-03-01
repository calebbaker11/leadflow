import OpenAI from 'openai'
import type { TemplateType } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const templateContext: Record<TemplateType, string> = {
  freelancer: 'a freelance professional offering specialized skills and services',
  agency: 'a full-service agency with a dedicated team of specialists',
  contractor: 'a licensed contractor providing professional trade or construction services',
  consultant: 'a business consultant providing strategic expertise and advisory services',
}

export async function generateProposal({
  clientName,
  businessType,
  templateType,
  scope,
  price,
  timeline,
  additionalNotes,
}: {
  clientName: string
  businessType: string
  templateType: TemplateType
  scope: string
  price: string
  timeline: string
  additionalNotes?: string
}) {
  const providerContext = templateContext[templateType]

  const prompt = `You are an expert business proposal writer. Generate a compelling, professional business proposal for ${providerContext}.

CLIENT INFORMATION:
- Client Name: ${clientName}
- Client's Business Type: ${businessType}

PROJECT DETAILS:
- Scope of Work: ${scope}
- Investment: ${price}
- Timeline: ${timeline}
${additionalNotes ? `- Additional Notes: ${additionalNotes}` : ''}

Write a complete, professional proposal with these exact sections using markdown formatting:

## Executive Summary
[2-3 sentences that capture the essence of the engagement, the client's need, and the value you provide. Make it compelling.]

## Understanding Your Needs
[Show you understand the client's business challenges and goals. Be specific to their business type and scope.]

## Proposed Scope of Work
[Detailed breakdown of exactly what will be delivered. Use bullet points for clarity. Be specific and professional.]

## Project Timeline
[Clear timeline breakdown with phases. Reference the provided timeline. Structure it logically.]

## Investment
[Professional pricing presentation. Include what's covered. State the total investment clearly.]

## Payment Terms
[Standard professional payment terms — typically 50% upfront, 50% on completion, or milestone-based. Adjust based on project scope.]

## Why Work With Us
[3-4 compelling reasons. Focus on value, expertise, and outcomes — not features.]

## Next Steps
[Clear call to action. What should the client do to move forward? Keep it simple and easy to act on.]

---
*This proposal is valid for 30 days from the date of issue.*

Use confident, professional business language. Be specific about deliverables. Keep it persuasive but not pushy. The tone should be warm, expert, and results-focused.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert business proposal writer who helps service businesses win clients. You write clear, professional, and persuasive proposals that focus on value and outcomes.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  return response.choices[0].message.content || ''
}
