'use client'

import { useState, useEffect } from 'react'

export default function HealthRecommendations({ data }) {
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const generateRecommendations = () => {
      const newRecommendations = []

      if (data.heartRate > 100) {
        newRecommendations.push("Your heart rate is elevated. Consider relaxation techniques or consulting a doctor.")
      }

      if (parseInt(data.bloodPressure.split('/')[0]) > 140) {
        newRecommendations.push("Your blood pressure is high. Reduce salt intake and increase physical activity.")
      }

      if (data.oxygenSaturation < 95) {
        newRecommendations.push("Your oxygen saturation is low. Practice deep breathing exercises and consult a doctor.")
      }

      setRecommendations(newRecommendations)
    }

    if (data) {
      generateRecommendations()
    }
  }, [data])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Health Recommendations</h3>
      {recommendations.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      ) : (
        <p>No specific recommendations at this time. Keep up the good work!</p>
      )}
    </div>
  )
}

