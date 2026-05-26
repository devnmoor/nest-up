import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeFurnMats } from './makeFurnMats'
import { useFurnSpring } from './useFurnSpring'

export const TABLE_SPAWN = new THREE.Vector3(-1.28, 0.0, 0)

export default function SideTable({ active }) {
  const groupRef = useRef()
  useFurnSpring(groupRef, active, TABLE_SPAWN)

  const { solid, wire, sU, wU } = useMemo(() => makeFurnMats(0.11, 0.28), [])

  const topGeo   = useMemo(() => new THREE.BoxGeometry(1.05, 0.07, 0.72), [])
  const legGeo   = useMemo(() => new THREE.CylinderGeometry(0.038, 0.038, 0.68, 8), [])
  const vaseGeo  = useMemo(() => new THREE.CylinderGeometry(0.07, 0.12, 0.30, 14), [])
  const vaseLidGeo = useMemo(() => new THREE.SphereGeometry(0.08, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), [])
  // Simple leaf planes
  const leafGeo  = useMemo(() => new THREE.PlaneGeometry(0.22, 0.38), [])

  useFrame(s => { sU.uTime.value = wU.uTime.value = s.clock.elapsedTime })

  const legPositions = [
    [-0.44, -0.375, 0.30],
    [ 0.44, -0.375, 0.30],
    [-0.44, -0.375, -0.30],
    [ 0.44, -0.375, -0.30],
  ]

  return (
    <group ref={groupRef}>
      {/* Table top */}
      <mesh position={[0, 0, 0]}     geometry={topGeo}  material={solid} />
      <mesh position={[0, 0, 0]}     geometry={topGeo}  material={wire}  />
      {/* Legs */}
      {legPositions.map(([x, y, z], i) => (
        <group key={i}>
          <mesh position={[x, y, z]} geometry={legGeo}  material={solid} />
          <mesh position={[x, y, z]} geometry={legGeo}  material={wire}  />
        </group>
      ))}
      {/* Small vase on tabletop */}
      <mesh position={[0.2, 0.185, 0.05]}  geometry={vaseGeo}   material={solid} />
      <mesh position={[0.2, 0.185, 0.05]}  geometry={vaseGeo}   material={wire}  />
      <mesh position={[0.2, 0.335, 0.05]}  geometry={vaseLidGeo} material={solid} />
      <mesh position={[0.2, 0.335, 0.05]}  geometry={vaseLidGeo} material={wire}  />
      {/* Leaf blades growing from vase */}
      <mesh position={[0.2, 0.52, 0.05]} rotation={[0.3, 0.5,  0.6]} geometry={leafGeo} material={solid} />
      <mesh position={[0.2, 0.52, 0.05]} rotation={[0.3, 0.5,  0.6]} geometry={leafGeo} material={wire}  />
      <mesh position={[0.2, 0.52, 0.05]} rotation={[-0.2, -0.3, -0.4]} geometry={leafGeo} material={solid} />
      <mesh position={[0.2, 0.52, 0.05]} rotation={[-0.2, -0.3, -0.4]} geometry={leafGeo} material={wire}  />
      <mesh position={[0.2, 0.52, 0.05]} rotation={[0.1, 1.2, 0.2]}  geometry={leafGeo} material={solid} />
      <mesh position={[0.2, 0.52, 0.05]} rotation={[0.1, 1.2, 0.2]}  geometry={leafGeo} material={wire}  />
    </group>
  )
}
