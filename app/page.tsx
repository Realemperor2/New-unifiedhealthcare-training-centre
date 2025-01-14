import HealthDashboard from '@/components/health/HealthDashboard'
import ProductionPreview from '@/components/production/ProductionPreview'
import AIModelPreview from '@/components/ai/AIModelPreview'
import InsurancePreview from '@/components/insurance/InsurancePreview'

export default function Home() {
  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold mb-8">Unified Healthcare App</h1>
      <HealthDashboard />
      <ProductionPreview />
      <AIModelPreview />
      <InsurancePreview />
    </div>
  )
}

