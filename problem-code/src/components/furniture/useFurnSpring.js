// Shared spring emerge hook for all furniture pieces
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const SPRING_K      = 10.0
const SPRING_B      = 6.5
const FURNITURE_SCALE = 0.82   // final size relative to geometry — keeps pieces compact vs blob

export function useFurnSpring(groupRef, active, spawnPos) {
  const sc = useRef(0)
  const vl = useRef(0)

  useFrame((_, delta) => {
    const dt     = Math.min(delta, 0.05)
    const target = active ? 1 : 0

    vl.current += (target - sc.current) * SPRING_K * dt
    vl.current -= vl.current * SPRING_B * dt
    sc.current  = Math.max(0, sc.current + vl.current * dt)

    if (groupRef.current) {
      // Apply furniture scale so pieces don't overpower the blob
      groupRef.current.scale.setScalar(sc.current * FURNITURE_SCALE)
      // Position: moves from origin → spawnPos as spring value rises
      groupRef.current.position.copy(spawnPos).multiplyScalar(sc.current)
    }
  })

  return sc
}
