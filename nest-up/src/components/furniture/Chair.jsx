import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeFurnMats } from './makeFurnMats'
import { useFurnSpring } from './useFurnSpring'

// Closer to blob surface so base visually merges with the shell
export const CHAIR_SPAWN = new THREE.Vector3(1.28, 0.0, 0)

export default function Chair({ active }) {
  const groupRef = useRef()
  useFurnSpring(groupRef, active, CHAIR_SPAWN)

  const { solid, wire, sU, wU } = useMemo(() => makeFurnMats(0.11, 0.28), [])

  // Geometries (memoised — never recreated)
  const seatGeo  = useMemo(() => new THREE.BoxGeometry(1.15, 0.13, 0.95), [])
  const backGeo  = useMemo(() => new THREE.BoxGeometry(1.15, 0.92, 0.10), [])
  const armGeo   = useMemo(() => new THREE.BoxGeometry(0.10, 0.18, 0.95), [])
  const legGeo   = useMemo(() => new THREE.CylinderGeometry(0.038, 0.038, 0.60, 8), [])

  useFrame(s => { sU.uTime.value = wU.uTime.value = s.clock.elapsedTime })

  // Leg positions relative to group origin (seat at y=0)
  const legPositions = [
    [-0.48,  -0.36,  0.38],
    [ 0.48,  -0.36,  0.38],
    [-0.48,  -0.36, -0.38],
    [ 0.48,  -0.36, -0.38],
  ]

  return (
    <group ref={groupRef}>
      {/* Seat cushion */}
      <mesh position={[0, 0, 0]}       geometry={seatGeo} material={solid} />
      <mesh position={[0, 0, 0]}       geometry={seatGeo} material={wire}  />
      {/* Back rest */}
      <mesh position={[0, 0.525, -0.425]} geometry={backGeo} material={solid} />
      <mesh position={[0, 0.525, -0.425]} geometry={backGeo} material={wire}  />
      {/* Left arm */}
      <mesh position={[-0.525, 0.09, 0]}  geometry={armGeo}  material={solid} />
      <mesh position={[-0.525, 0.09, 0]}  geometry={armGeo}  material={wire}  />
      {/* Right arm */}
      <mesh position={[ 0.525, 0.09, 0]}  geometry={armGeo}  material={solid} />
      <mesh position={[ 0.525, 0.09, 0]}  geometry={armGeo}  material={wire}  />
      {/* Four legs */}
      {legPositions.map(([x, y, z], i) => (
        <group key={i}>
          <mesh position={[x, y, z]} geometry={legGeo} material={solid} />
          <mesh position={[x, y, z]} geometry={legGeo} material={wire}  />
        </group>
      ))}
    </group>
  )
}
