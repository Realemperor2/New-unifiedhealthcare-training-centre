'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function HolographicBody({ data }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentRef = mountRef.current
    const { clientWidth: width, clientHeight: height } = currentRef

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()

    renderer.setSize(width, height)
    currentRef.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5

    const controls = new OrbitControls(camera, renderer.domElement)

    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      currentRef.removeChild(renderer.domElement)
    }
  }, [data])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Holographic Body</h3>
      <div ref={mountRef} style={{ width: '100%', height: '400px' }} />
    </div>
  )
}

