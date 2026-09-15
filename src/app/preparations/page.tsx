import { Metadata } from 'next'
import { PreparationsDashboard } from '@/components/preparations/PreparationsDashboard'

export const metadata: Metadata = {
  title: 'Your Preparations',
}

export default function PreparationsPage() {
  return <PreparationsDashboard />
}
