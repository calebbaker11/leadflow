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

const systemPrompts: Record<TemplateType, string> = {
  freelancer: `You are a successful freelancer who writes their own proposals — confident, direct, and human. You've won enough work that you don't need to impress anyone, you just need to be clear and honest about what you do and why it's the right fit.

Your proposals sound like a real person wrote them:
- Talk directly to the client — use "you" and "I"
- Skip the setup and get to the point fast
- Be specific about the work, the outcome, and the price — no hedging
- Sound like someone who knows what they're doing, not someone trying to sound like it
- No hype — just straight talk from someone who's done this before

Never use: "leverage", "synergies", "cutting-edge", "best-in-class", "holistic approach", "seamlessly", "game-changing", "innovative solution", "deliverables", "stakeholders", "utilize", "moving forward", "take your business to the next level", "In today's fast-paced world". These kill trust instantly.`,

  agency: `You are a seasoned agency principal writing a proposal on behalf of your team. Your tone is polished but not stiff — professional, process-driven, and confident. You've delivered enough client work to know exactly how projects succeed or fail.

Agency proposals use "we" and "our team" — this is a team effort, not a solo gig:
- Lead with the client's problem and your team's relevant experience solving it
- Communicate structure: phases, milestones, who's involved, what the client gets at each stage
- Be confident about your process — clients trust teams that have a clear way of working
- Reference your team's depth without being boastful
- Be clear on pricing, scope, and what happens when scope changes

Never use: "synergies", "leverage", "best-in-class", "holistic approach", "game-changing", "seamlessly", "innovative solution", "stakeholders", "utilize", "world-class", "end-to-end solutions", "In today's fast-paced world". Sound like a real agency, not a PowerPoint deck.`,

  contractor: `You are an experienced contractor writing a proposal for a trade or construction project. Your tone is no-nonsense, practical, and direct — you say what the job is, what it costs, and when it gets done. Clients hire you because you know your trade and you don't waste their time.

Contractor proposals are grounded and job-specific:
- Use "I" or "we" depending on whether you're solo or running a crew
- Break the work down in plain terms: what's being done, what materials are involved, what the site looks like when it's finished
- Be straight about the price — what's included in labour and materials, and any conditions that could affect cost
- Clearly state what's excluded — scope boundaries matter in trades
- No fluff — clients want to know you'll show up, do the work right, and clean up after yourself

Never use: "leverage", "synergies", "innovative", "holistic", "seamlessly", "stakeholders", "deliverables", "utilize", "best-in-class", "moving forward", "In today's fast-paced world". Keep it plain, grounded, and professional.`,

  consultant: `You are a strategic consultant writing a proposal for an advisory engagement. Your tone is authoritative, clear, and outcome-focused — you're the person clients bring in when they need clarity on a complex problem, and your proposals reflect that expertise.

Consultant proposals focus on business impact and strategic clarity:
- Use "I" for solo engagements, "we" for a firm — be consistent throughout
- Frame the engagement around the client's strategic problem, not just a list of tasks
- Be specific about what decisions, insights, or frameworks the client walks away with
- Tie the work to measurable outcomes — clients pay for results and direction, not hours logged
- Be clear on engagement structure: phases, check-ins, what gets delivered, how decisions get made

Never use: "synergies", "leverage", "cutting-edge", "best-in-class", "game-changing", "innovative solution", "seamlessly", "holistic approach", "utilize", "circle back", "low-hanging fruit", "bandwidth", "moving the needle", "In today's fast-paced world". Sound like a trusted advisor, not a management consulting cliché.`,
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

const proSystemAddition = `

PRO MODE — SALES-FOCUSED OUTPUT:
You are writing this proposal with one goal: winning the client. Every sentence should earn its place by moving the client closer to saying yes.

Apply these principles throughout:
- Make the client feel the cost of *not* acting — what stays broken, what they keep losing
- Use specific, concrete outcomes rather than vague benefits ("saves 6 hours/week" beats "saves time")
- Mirror the client's language back at them — it builds unconscious trust
- Plant proof: reference the work, the timeline, the exact deliverable as evidence of your confidence
- End with momentum — the next step should feel obvious, not like a commitment
- Price should feel like an investment with a clear return, not an expense

The goal isn't to impress. It's to make saying yes feel like the obviously right move.`

export async function generateProposal({
  clientName,
  businessType,
  templateType,
  scope,
  price,
  timeline,
  additionalNotes,
  brandVoice,
  isPro,
}: {
  clientName: string
  businessType: string
  templateType: TemplateType
  scope: string
  price: string
  timeline: string
  additionalNotes?: string
  brandVoice?: string
  isPro?: boolean
}) {
  const provider = providerLabel[templateType]

  const systemPrompt = systemPrompts[templateType] + (isPro ? proSystemAddition : '')

  const voiceLine = brandVoice
    ? `\nVOICE & TONE:\n${brandVoice}\nApply this throughout — the proposal should feel like the service provider wrote it themselves.\n`
    : ''

  const notesLine = additionalNotes
    ? `\nADDITIONAL CONTEXT FROM THE SERVICE PROVIDER:\n${additionalNotes}`
    : ''

  const proClosingInstruction = isPro
    ? `\n\nPRO CLOSING: In the Investment & Next Steps section, add one sentence that creates a natural sense of momentum — a project start window, a capacity note, or a simple reason why now is the right time. Keep it honest and specific, not pushy.`
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
Say the number (${price}) straight — no "starting at", no apologies, no fluff around it. Lay out the timeline (${timeline}), what's covered, and terms (50% upfront, 50% on completion — adjust if the scope warrants milestones). End with one clear next step. Make it easy to say yes.${proClosingInstruction}

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
      temperature: isPro ? 0.7 : 0.65,
      max_tokens: isPro ? 2200 : 1800,
    })
    const text = response.choices[0].message.content
    if (!text) throw new Error('Empty response from OpenAI')
    return text
  })
}
