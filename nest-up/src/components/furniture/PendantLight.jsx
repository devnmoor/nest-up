import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeFurnMats } from './makeFurnMats'
import { useFurnSpring } from './useFurnSpring'

// Pendant hangs from top — group origin = ceiling attachment point
export const PENDANT_SPAWN = new THREE.Vector3(0, 1.52, 0)

// Bell-curve shade profile for LatheGeometry (revolves around Y)
// Profile goes from narrow top to wide open rim at bottom
function makeShadeProfile() {
  return [
    new THREE.Vector2(0.04, 0.58),   // narrow top (near cord)
    new THREE.Vector2(0.12, 0.48),
    new THREE.Vector2(0.22, 0.34),
    new THREE.Vector2(0.34, 0.18),
    new THREE.Vector2(0.44, 0.05),
    new THREE.Vector2(0.46, 0.0),    // open rim at bottom
  ]
}

export default function PendantLight({ active }) {
  const groupRef = useRef()
  useFurnSpring(groupRef, active, PENDANT_SPAWN)

  const { solid, wire, sU, wU } = useMemo(() => makeFurnMats(0.11, 0.28), [])

  // Cord hangs from origin (y=0) down to shade top
  const cordGeo  = useMemo(() => new THREE.CylinderGeometry(0.009, 0.009, 0.82, 6), [])
  const shadeGeo = useMemo(() => new THREE.LatheGeometry(makeShadeProfile(), 24), [])

  useFrame(s => { sU.uTime.value = wU.uTime.value = s.clock.elapsedTime })

  // Cord center: y = -0.41 (from 0 to -0.82)
  // Shade: positioned at y = -0.82 (top of shade at y = -0.82 + 0.58 = -0.24? No...)
  // Shade profile top is at y=0.58 in local space — we want that to be at y=-0.82 world
  // So shade position.y = -0.82 - 0.58 = -1.40 ... wait let me think.
  //
  // After LatheGeometry, y=0.58 is the TOP of the shade, y=0.0 is the OPEN BOTTOM.
  // We want the shade top to connect to cord bottom at y=-0.82.
  // So we position the shade so its top (local y=0.58) is at world y=-0.82.
  // shade.position.y = -0.82 - 0.58 = -1.40

  return (
    <group ref={groupRef}>
      {/* Cord: from y=0 (attachment) down to y=-0.82 */}
      <mesh position={[0, -0.41, 0]} geometry={cordGeo}  material={solid} />
      <mesh position={[0, -0.41, 0]} geometry={cordGeo}  material={wire}  />
      {/* Shade: top at y=-0.82, opens downward */}
      <mesh position={[0, -1.40, 0]} geometry={shadeGeo} material={solid} />
      <mesh position={[0, -1.40, 0]} geometry={shadeGeo} material={wire}  />
    </group>
  )
}
