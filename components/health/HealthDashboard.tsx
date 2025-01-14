'use client'

import { useState, useEffect } from 'react'
import HealthScan from './HealthScan'
import HealthMetrics from './HealthMetrics'
import HolographicBody from './HolographicBody'
import HealthReports from './HealthReports'
import HealthTrends from './HealthTrends'
import HealthRecommendations from './HealthRecommendations'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCwIcon as ReloadIcon } from 'lucide-react'

export default function HealthDashboard() {
  const [healthData, setHealthData] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch('/api/health-data')
        if (!response.ok) {
          throw new Error('Failed to fetch health data')
        }
        const data = await response.json()
        setHealthData(data)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch health data:', error)
        setError('Failed to fetch health data. Please try again later.')
      }
    }

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch('/api/health-data/historical')
        if (!response.ok) {
          throw new Error('Failed to fetch historical health data')
        }
        const data = await response.json()
        setHistoricalData(data)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch historical health data:', error)
        setError('Failed to fetch historical health data. Please try again later.')
      }
    }

    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchHealthData(), fetchHistoricalData()])
      setLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading health data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Health Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthScan onScanComplete={setHealthData} />
        {healthData ? <HealthMetrics data={healthData} /> : null}
        <HolographicBody data={healthData} />
        <HealthReports data={healthData} />
        <HealthTrends data={historicalData} />
        <HealthRecommendations data={healthData} />
      </div>
    </div>
  )
}

