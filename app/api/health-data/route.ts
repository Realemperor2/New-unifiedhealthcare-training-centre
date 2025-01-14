import { NextResponse } from 'next/server'

export async function GET() {
  // In a real app, this would fetch data from a database or external API
  const mockData = {
    heartRate: Math.floor(Math.random() * (100 - 60) + 60),
    bloodPressure: `${Math.floor(Math.random() * (140 - 100) + 100)}/${Math.floor(Math.random() * (90 - 60) + 60)}`,
    temperature: (Math.random() * (99.5 - 97.5) + 97.5).toFixed(1),
    oxygenSaturation: Math.floor(Math.random() * (100 - 95) + 95),
  }

  return NextResponse.json(mockData)
}

