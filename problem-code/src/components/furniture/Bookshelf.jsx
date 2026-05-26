import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeFurnMats } from './makeFurnMats'
import { useFurnSpring } from './useFurnSpring'

export const SHELF_SPAWN = new THREE.Vector3(1.18, -0.82, 0)

// Book data: [width, height, xOffset, shelfY]
const BOOKS = [
  [0.10, 0.42, -0.38, 0.255],
  [0.14, 0.38, -0.26, 0.255],
  [0.09, 0.44, -0.14, 0.255],
  [0.12, 0.36, -0.03, 0.255],
  [0.13, 0.40,  0.10, 0.255],
  [0.10, 0.43,  0.22, 0.255],
  [0.09, 0.33,  0.10, -0.26],
  [0.14, 0.38, -0.10, -0.26],
  [0.11, 0.35, -0.28, -0.26],
]

export default function Bookshelf({ active }) {
  const groupRef = useRef()
  useFurnSpring(groupRef, active, SHELF_SPAWN)

  const { solid, wire, sU, wU } = useMemo(() => makeFurnMats(0.11, 0.28), [])

  // Frame pieces
  const sideGeo   = useMemo(() => new THREE.BoxGeometry(0.055, 1.45, 0.42), [])
  const topBotGeo = useMemo(() => new THREE.BoxGeometry(1.12, 0.055, 0.42), [])
  const backGeo   = useMemo(() => new THREE.BoxGeometry(1.12, 1.45, 0.032), [])
  const shelfGeo  = useMemo(() => new THREE.BoxGeometry(1.06, 0.045, 0.40), [])
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.065, 8, 6), [])

  // Memoised book geometries keyed by width×height
  const bookGeos  = useMemo(() =>
    BOOKS.map(([w, h]) => new THREE.BoxGeometry(w, h, 0.35))
  , [])

  useFrame(s => { sU.uTime.value = wU.uTime.value = s.clock.elapsedTime })

  function P({ geo, pos, rot }) {
    return (
      <>
        <mesh position={pos} rotation={rot || [0,0,0]} geometry={geo} material={solid} />
        <mesh position={pos} rotation={rot || [0,0,0]} geometry={geo} material={wire}  />
      </>
    )
  }

  return (
    <group ref={groupRef}>
      {/* Left + right side panels */}
      <P geo={sideGeo}   pos={[-0.533, 0, 0]} />
      <P geo={sideGeo}   pos={[ 0.533, 0, 0]} />
      {/* Top + bottom */}
      <P geo={topBotGeo} pos={[0,  0.75, 0]} />
      <P geo={topBotGeo} pos={[0, -0.75, 0]} />
      {/* Back panel */}
      <P geo={backGeo}   pos={[0, 0, -0.194]} />
      {/* Two interior shelves */}
      <P geo={shelfGeo}  pos={[0,  0.23, 0]} />
      <P geo={shelfGeo}  pos={[0, -0.28, 0]} />
      {/* Books */}
      {BOOKS.map(([, , xOff, shY], i) => (
        <P key={i} geo={bookGeos[i]} pos={[xOff, shY, 0.025]} />
      ))}
      {/* Small decorative sphere on top shelf */}
      <P geo={sphereGeo} pos={[0.38, 0.31, 0.04]} />
    </group>
  )
}
