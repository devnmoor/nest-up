import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeFurnMats } from './makeFurnMats'
import { useFurnSpring } from './useFurnSpring'

export const PLANT_SPAWN = new THREE.Vector3(-1.08, -0.92, 0)

// Lathe profile for a tapered pot shape
function makePotProfile() {
  return [
    new THREE.Vector2(0.0,   0.40),   // bottom centre
    new THREE.Vector2(0.12,  0.38),
    new THREE.Vector2(0.22,  0.30),
    new THREE.Vector2(0.28,  0.18),
    new THREE.Vector2(0.30,  0.05),
    new THREE.Vector2(0.28,  0.0),    // wide rim at top
  ].reverse() // lathe from top down
}

export default function Plant({ active }) {
  const groupRef = useRef()
  useFurnSpring(groupRef, active, PLANT_SPAWN)

  const { solid, wire, sU, wU } = useMemo(() => makeFurnMats(0.11, 0.28), [])

  const potGeo    = useMemo(() => new THREE.LatheGeometry(makePotProfile(), 20), [])
  const soilGeo   = useMemo(() => new THREE.CylinderGeometry(0.27, 0.27, 0.03, 16), [])
  const stemGeo   = useMemo(() => new THREE.CylinderGeometry(0.018, 0.022, 0.55, 6), [])
  const leafGeo   = useMemo(() => new THREE.PlaneGeometry(0.28, 0.52), [])

  useFrame(s => { sU.uTime.value = wU.uTime.value = s.clock.elapsedTime })

  // Three stems at slight angles, leaves attached to each
  const stems = [
    { pos: [0.06, 0.32, 0.08],  rot: [0, 0,  0.25], leafRot: [0.4,  0.2, 0.3]  },
    { pos: [-0.05, 0.32, -0.04], rot: [0, 0, -0.18], leafRot: [0.5, -0.4, -0.2] },
    { pos: [0.02,  0.32,  0.12], rot: [0.15, 0, 0.05], leafRot: [-0.3, 0.8, 0.1] },
  ]

  return (
    <group ref={groupRef}>
      {/* Pot */}
      <mesh position={[0, 0, 0]}       geometry={potGeo}  material={solid} />
      <mesh position={[0, 0, 0]}       geometry={potGeo}  material={wire}  />
      {/* Soil surface */}
      <mesh position={[0, 0.41, 0]}    geometry={soilGeo} material={solid} />
      <mesh position={[0, 0.41, 0]}    geometry={soilGeo} material={wire}  />
      {/* Stems + leaves */}
      {stems.map(({ pos, rot, leafRot }, i) => (
        <group key={i}>
          <mesh position={pos} rotation={rot} geometry={stemGeo} material={solid} />
          <mesh position={pos} rotation={rot} geometry={stemGeo} material={wire}  />
          <mesh
            position={[pos[0], pos[1] + 0.36, pos[2]]}
            rotation={leafRot}
            geometry={leafGeo}
            material={solid}
          />
          <mesh
            position={[pos[0], pos[1] + 0.36, pos[2]]}
            rotation={leafRot}
            geometry={leafGeo}
            material={wire}
          />
        </group>
      ))}
    </group>
  )
}
