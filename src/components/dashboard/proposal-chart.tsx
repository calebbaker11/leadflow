'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export interface MonthlyDataPoint {
  month: string
  sent: number
  accepted: number
  declined: number
  draft: number
}

interface TooltipEntry {
  dataKey?: string | number
  name?: string
  value?: number
  fill?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const entries = payload.filter(p => (p.value ?? 0) > 0)
  if (!entries.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-text-secondary mb-1.5">{label}</p>
      {entries.map(entry => (
        <div key={String(entry.dataKey)} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: entry.fill }} />
          <span className="text-text-muted capitalize">{entry.name}</span>
          <span className="ml-auto font-semibold text-text-primary pl-4">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

interface ProposalChartProps {
  data: MonthlyDataPoint[]
}

export function ProposalChart({ data }: ProposalChartProps) {
  const hasData = data.some(d => d.sent + d.accepted + d.declined + d.draft > 0)

  return (
    <div className="w-full">
      {!hasData ? (
        <div className="flex h-[180px] items-center justify-center text-xs text-text-muted">
          No proposal activity yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barCategoryGap="35%" barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="sent"     name="Sent"     fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={20} />
            <Bar dataKey="accepted" name="Accepted" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={20} />
            <Bar dataKey="declined" name="Declined" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={20} />
            <Bar dataKey="draft"    name="Draft"    fill="#2a2a2a" radius={[3, 3, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
