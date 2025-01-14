'use client'

import { useState, useEffect } from 'react'
import HealthSummary from '@/components/health/HealthSummary'
import ProductionSummary from '@/components/production/ProductionSummary'
import AIModelSummary from '@/components/ai/AIModelSummary'
import InsuranceSummary from '@/components/insurance/InsuranceSummary'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCwIcon as ReloadIcon } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function UserDashboard() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user-dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        setUserData(data)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        setError('Failed to fetch user data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const overallScoreData = {
    labels: ['Health', 'Production', 'AI Models', 'Insurance'],
    datasets: [
      {
        data: [
          userData?.healthData.overallScore || 0,
          userData?.productionData.efficiency || 0,
          userData?.aiModels.accuracy || 0,
          userData?.insuranceData.coveragePercentage || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading dashboard data...</span>
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {userData?.name || 'User'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Overall Performance</h3>
            <Doughnut data={overallScoreData} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Quick Stats</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Health Score: {userData?.healthData.overallScore}%</li>
              <li>Production Efficiency: {userData?.productionData.efficiency}%</li>
              <li>Active AI Models: {userData?.aiModels.totalModels}</li>
              <li>Insurance Coverage: {userData?.insuranceData.coverageAmount}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HealthSummary data={userData.healthData} />
        <ProductionSummary data={userData.productionData} />
        <AIModelSummary data={userData.aiModels} />
        <InsuranceSummary data={userData.insuranceData} />
      </div>
    </div>
  )
}

