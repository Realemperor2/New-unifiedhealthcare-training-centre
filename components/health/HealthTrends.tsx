'use client'

import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function HealthTrends({ data }) {
  const [selectedMetric, setSelectedMetric] = useState('heartRate')

  const metrics = {
    heartRate: { label: 'Heart Rate', color: 'rgb(255, 99, 132)' },
    bloodPressure: { label: 'Blood Pressure (Systolic)', color: 'rgb(54, 162, 235)' },
    oxygenSaturation: { label: 'Oxygen Saturation', color: 'rgb(75, 192, 192)' },
  }

  const chartData = {
    labels: data.map(entry => entry.date),
    datasets: [
      {
        label: metrics[selectedMetric].label,
        data: data.map(entry => 
          selectedMetric === 'bloodPressure' 
            ? parseInt(entry.bloodPressure.split('/')[0])
            : entry[selectedMetric]
        ),
        borderColor: metrics[selectedMetric].color,
        backgroundColor: metrics[selectedMetric].color.replace('rgb', 'rgba').replace(')', ', 0.5)'),
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
        text: 'Health Trends Over Time',
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Health Trends</h3>
      <Select onValueChange={setSelectedMetric} defaultValue={selectedMetric}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select metric" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(metrics).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Line options={options} data={chartData} />
    </div>
  )
}

