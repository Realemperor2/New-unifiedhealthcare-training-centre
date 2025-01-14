'use client'

import { Bar } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface HealthData {
  heartRate: number
  bloodPressure: string
  temperature: number
  oxygenSaturation: number
}

export default function HealthMetrics({ data }: { data: HealthData }) {
  const chartData = {
    labels: ['Heart Rate', 'Blood Pressure', 'Temperature', 'Oxygen Saturation'],
    datasets: [
      {
        label: 'Health Metrics',
        data: [data.heartRate, parseInt(data.bloodPressure.split('/')[0]), data.temperature, data.oxygenSaturation],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Current Health Metrics',
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Health Metrics</h3>
      <Bar data={chartData} options={options} />
    </div>
  )
}

