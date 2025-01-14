'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCwIcon as ReloadIcon } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function AIModelCreator() {
  const [modelType, setModelType] = useState('')
  const [dataset, setDataset] = useState(null)
  const [training, setTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [trainingMetrics, setTrainingMetrics] = useState({ loss: [], accuracy: [] })
  const [error, setError] = useState(null)

  const handleDatasetUpload = (event) => {
    const file = event.target.files[0]
    setDataset(file)
  }

  const startTraining = async () => {
    try {
      setTraining(true)
      setTrainingProgress(0)
      setTrainingMetrics({ loss: [], accuracy: [] })
      setError(null)

      const formData = new FormData()
      formData.append('modelType', modelType)
      formData.append('dataset', dataset)

      const response = await fetch('/api/train-model', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to start model training')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const data = JSON.parse(chunk)

        setTrainingProgress(data.progress)
        setTrainingMetrics(prev => ({
          loss: [...prev.loss, data.loss],
          accuracy: [...prev.accuracy, data.accuracy],
        }))
      }

      alert('Model training complete!')
    } catch (error) {
      console.error('Failed to train model:', error)
      setError('Failed to train model. Please try again later.')
    } finally {
      setTraining(false)
    }
  }

  const chartData = {
    labels: trainingMetrics.loss.length > 0 ? trainingMetrics.loss.map((_, index) => `Epoch ${index + 1}`) : [],
    datasets: [
      {
        label: 'Loss',
        data: trainingMetrics.loss,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Accuracy',
        data: trainingMetrics.accuracy,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Training Metrics',
      },
    },
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Model Configuration</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="modelType">Model Type:</Label>
            <Select onValueChange={setModelType} value={modelType}>
              <SelectTrigger id="modelType">
                <SelectValue placeholder="Select a model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare Diagnosis</SelectItem>
                <SelectItem value="production">Production Quality Control</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dataset">Upload Dataset:</Label>
            <Input
              type="file"
              id="dataset"
              onChange={handleDatasetUpload}
            />
          </div>
          <Button
            onClick={startTraining}
            disabled={!modelType || !dataset || training}
          >
            {training ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Training...
              </>
            ) : (
              'Start Training'
            )}
          </Button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Training Progress</h3>
        <Line options={chartOptions} data={chartData} />
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${trainingProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">{trainingProgress}% Complete</p>
        </div>
      </div>
    </div>
  )
}

