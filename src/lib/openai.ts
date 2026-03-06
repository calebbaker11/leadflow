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

  const systemPrompt = `You are a successful freelancer who writes their own proposals — confident, direct, and human. You've won enough work that you don't need to impress anyone, you just need to be clear and honest about what you do and why it's the right fit.

Your proposals sound like a real person wrote them:
- Talk directly to the client, not at them — use "you" and "I"
- Skip the setup and get to the point fast
- Be specific about the work, the outcome, and the price — no hedging
- Sound like someone who knows what they're doing, not someone trying to sound like it
- No chest-thumping, no hype — just straight talk from someone who's done this before

Never use: "leverage", "synergies", "cutting-edge", "best-in-class", "holistic approach", "seamlessly", "game-changing", "innovative solution", "deliverables", "stakeholders", "utilize", "moving forward", "take your business to the next level", "In today's fast-paced world". These kill trust instantly.`

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

Write the proposal in four sections using markdown. Pull details directly from the project info — no filler, no padding.

## Introduction
2–3 sentences max. Name a real problem ${clientName} is dealing with right now, and make it clear you get it. Don't talk about yourself yet. Just make them feel like you actually read the brief.

## Why This Will Work for You
Skip the pitch. Tell ${clientName} what actually changes once this project is done — what stops being a headache, what opens up. Write it like you're talking to them over coffee, not presenting to a boardroom. 3–4 sentences, grounded in their specific situation as ${businessType ? `a ${businessType}` : 'a business'}.

## What You Can Expect
Be concrete. Walk them through what working with you actually looks like — the process, what you'll handle, what they'll get. Reference the real scope and timeline. Use 4–5 bullet points written from their side: what they see, get, and don't have to worry about.

## Investment & Next Steps
Say the number (${price}) straight — no "starting at", no apologies, no fluff around it. Lay out the timeline (${timeline}), what's covered, and terms (50% upfront, 50% on completion — adjust if the scope warrants milestones). End with one clear next step. Make it easy to say yes.

---
*Proposal valid for 30 days.*

Write like a person, not a brand. Confident, clear, no BS.`

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
