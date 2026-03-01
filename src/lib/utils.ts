import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Extracts a rough numeric value from price strings like "$5,000", "5000", "$2k-5k"
export function extractPriceValue(priceStr: string): number {
  const cleaned = priceStr.replace(/[$,k]/gi, '')
  const match = cleaned.match(/\d+/)
  if (!match) return 0
  const value = parseFloat(match[0])
  return priceStr.toLowerCase().includes('k') ? value * 1000 : value
}

export function generateShareUrl(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/p/${token}`
}
