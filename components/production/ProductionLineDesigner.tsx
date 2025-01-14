'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCwIcon as ReloadIcon } from 'lucide-react'

function Machine({ position, rotation }) {
  const { scene } = useGLTF('/assets/3d/machine.glb')
  return scene ? (
    <primitive object={scene} position={position} rotation={rotation} />
  ) : null
}

function Conveyor({ start, end }) {
  return (
    <mesh position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2]}>
      <boxGeometry args={[Math.abs(end[0] - start[0]) || 0.1, 0.1, Math.abs(end[2] - start[2]) || 0.1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

function ProductionLine({ layout }) {
  return (
    <>
      {layout.machines.map((machine, index) => (
        <Machine key={index} position={machine.position} rotation={machine.rotation} />
      ))}
      {layout.conveyors.map((conveyor, index) => (
        <Conveyor key={index} start={conveyor.start} end={conveyor.end} />
      ))}
    </>
  )
}

export default function ProductionLineDesigner() {
  const [selectedLine, setSelectedLine] = useState(null)
  const [layout, setLayout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [productionLines, setProductionLines] = useState([])

  useEffect(() => {
    const fetchProductionLines = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/production-lines')
        if (!response.ok) {
          throw new Error('Failed to fetch production lines')
        }
        const data = await response.json()
        setProductionLines(data)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch production lines:', error)
        setError('Failed to fetch production lines. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProductionLines()
  }, [])

  const handleLineSelect = async (line) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/production-lines/${line.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch production line layout')
      }
      const layoutData = await response.json()
      setSelectedLine(line)
      setLayout(layoutData)
      setError(null)
    } catch (error) {
      console.error('Failed to fetch production line layout:', error)
      setError('Failed to fetch production line layout. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading production data...</span>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Available Production Lines</h3>
        <ul className="space-y-2">
          {productionLines.map((line) => (
            <li key={line.id}>
              <Button
                onClick={() => handleLineSelect(line)}
                variant={selectedLine?.id === line.id ? "default" : "outline"}
                className="w-full justify-start"
              >
                {line.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">3D Preview</h3>
        <div style={{ width: '100%', height: '400px' }}>
          <Canvas camera={{ position: [0, 5, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {layout && <ProductionLine layout={layout} />}
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </div>
  )
}

