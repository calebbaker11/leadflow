import OpenAI from 'openai'
import type { TemplateType } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const providerLabel: Record<TemplateType, string> = {
  freelancer:  'independent freelance professional',
  agency:      'full-service agency',
  contractor:  'licensed professional contractor',
  consultant:  'specialist business consultant',
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) {
        await new Promise(r => setTimeout(r, (i + 1) * 1500))
      }
    }
  }
  throw lastError
}

export async function generateProposal({
  clientName,
  businessType,
  templateType,
  scope,
  price,
  timeline,
  additionalNotes,
  brandVoice,
}: {
  clientName: string
  businessType: string
  templateType: TemplateType
  scope: string
  price: string
  timeline: string
  additionalNotes?: string
  brandVoice?: string
}) {
  const provider = providerLabel[templateType]

  const systemPrompt = `You are a senior sales strategist and proposal writer who has helped service businesses win over $50M in contracts. You write proposals that feel personal, credible, and genuinely valuable to receive — not like a template.

Your proposals follow these principles:
- Lead with what the client gains, not what the service provider does
- Make the client feel understood before pitching anything
- Use specific, concrete language — never vague buzzwords
- Sound like a real expert who cares about the outcome, not a salesperson
- Every section earns the reader's attention before asking for anything

Never use: "In today's fast-paced world", "leverage", "synergies", "cutting-edge", "best-in-class", "holistic approach", "seamlessly", "game-changing", "innovative solution", "take your business to the next level". These phrases signal AI and erode trust instantly.`

  const voiceLine = brandVoice
    ? `\nVOICE & TONE:\n${brandVoice}\nApply this throughout — the proposal should feel like the service provider wrote it themselves.\n`
    : ''

  const notesLine = additionalNotes
    ? `\nADDITIONAL CONTEXT FROM THE SERVICE PROVIDER:\n${additionalNotes}`
    : ''

  const userPrompt = `Write a proposal for a ${provider} pitching to ${clientName}${businessType ? `, a ${businessType}` : ''}.
${voiceLine}
PROJECT:
- Work: ${scope}
- Investment: ${price}
- Timeline: ${timeline}${notesLine}

Write the proposal in four sections using markdown. Be specific throughout — pull details directly from the project info above.

## Introduction
Two to three sentences. Open by naming a real challenge or goal that ${clientName} is likely facing right now, then connect it directly to why this specific project matters. Don't introduce the service provider yet. Make ${clientName} feel seen and understood.

## Why This Will Work for You
This is the value proposition — frame it entirely as outcomes for ${clientName}, not as a list of services. What changes for them after this project is done? What problem disappears? What becomes possible? Write in flowing prose (3–4 sentences), grounded in their specific context as ${businessType ? `a ${businessType}` : 'a business'}.

## What You Can Expect
Build credibility without chest-thumping. Describe the approach, the process, and what makes this service provider the right fit for this specific project. Reference the actual scope and timeline. Use 4–5 focused bullet points written from the client's perspective — what they experience and receive, not what the provider "does".

## Investment & Next Steps
State the investment (${price}) clearly and confidently — no hedging or apology. Describe the timeline (${timeline}), what's included, and payment terms (50% to start, 50% on completion, unless the scope clearly warrants milestones). Close with a single, low-friction next step. Make it easy to say yes — one action, clearly stated.

---
*Proposal valid for 30 days.*

Write like a trusted expert. Be direct. Be specific. Be human.`

  return withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.65,
      max_tokens: 1800,
    })
    const text = response.choices[0].message.content
    if (!text) throw new Error('Empty response from OpenAI')
    return text
  })
}
