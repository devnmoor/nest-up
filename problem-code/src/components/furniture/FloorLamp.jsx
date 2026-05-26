import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeFurnMats } from './makeFurnMats'
import { useFurnSpring } from './useFurnSpring'

export const LAMP_SPAWN = new THREE.Vector3(0.72, 1.18, 0)

export default function FloorLamp({ active }) {
  const groupRef = useRef()
  useFurnSpring(groupRef, active, LAMP_SPAWN)

  const { solid, wire, sU, wU } = useMemo(() => makeFurnMats(0.11, 0.28), [])

  const baseGeo  = useMemo(() => new THREE.CylinderGeometry(0.22, 0.28, 0.06, 16), [])
  const stemGeo  = useMemo(() => new THREE.CylinderGeometry(0.026, 0.026, 2.0, 8), [])
  // Open cone, flipped upside-down for a shade that opens downward
  const shadeGeo = useMemo(() => new THREE.ConeGeometry(0.48, 0.52, 20, 1, true), [])

  useFrame(s => { sU.uTime.value = wU.uTime.value = s.clock.elapsedTime })

  return (
    <group ref={groupRef}>
      {/* Base disc on floor */}
      <mesh position={[0, -1.03, 0]} geometry={baseGeo}  material={solid} />
      <mesh position={[0, -1.03, 0]} geometry={baseGeo}  material={wire}  />
      {/* Stem — centered vertically */}
      <mesh position={[0, 0, 0]}     geometry={stemGeo}  material={solid} />
      <mesh position={[0, 0, 0]}     geometry={stemGeo}  material={wire}  />
      {/* Shade at top, flipped so it opens downward */}
      <mesh
        position={[0, 1.06, 0]}
        rotation={[Math.PI, 0, 0]}
        geometry={shadeGeo}
        material={solid}
      />
      <mesh
        position={[0, 1.06, 0]}
        rotation={[Math.PI, 0, 0]}
        geometry={shadeGeo}
        material={wire}
      />
    </group>
  )
}
