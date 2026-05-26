import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import Chair,        { CHAIR_SPAWN   } from './furniture/Chair'
import FloorLamp,    { LAMP_SPAWN    } from './furniture/FloorLamp'
import SideTable,    { TABLE_SPAWN   } from './furniture/SideTable'
import Plant,        { PLANT_SPAWN   } from './furniture/Plant'
import PendantLight, { PENDANT_SPAWN } from './furniture/PendantLight'
import Bookshelf,    { SHELF_SPAWN   } from './furniture/Bookshelf'

const CYCLE = [
  { name: null,      dur: 3.0 },
  { name: 'chair',   dur: 5.5 },
  { name: null,      dur: 2.0 },
  { name: 'lamp',    dur: 5.5 },
  { name: null,      dur: 2.0 },
  { name: 'shelf',   dur: 5.5 },
  { name: null,      dur: 2.0 },
  { name: 'table',   dur: 5.5 },
  { name: null,      dur: 2.0 },
  { name: 'pendant', dur: 5.5 },
  { name: null,      dur: 2.0 },
  { name: 'plant',   dur: 5.5 },
  { name: null,      dur: 2.0 },
]

const SPAWN_MAP = {
  chair:   CHAIR_SPAWN,
  lamp:    LAMP_SPAWN,
  table:   TABLE_SPAWN,
  plant:   PLANT_SPAWN,
  pendant: PENDANT_SPAWN,
  shelf:   SHELF_SPAWN,
}

export default function FurnitureSystem({ spawnStateRef, onActiveChange }) {
  // useState drives re-renders so furniture components get the right `active` prop
  const [activeName, setActiveName] = useState(null)

  const idxRef    = useRef(0)
  const elapsedRef = useRef(0)
  const prevName  = useRef(null)

  // Spring for blob uSpawnStrength
  const sSc = useRef(0)
  const sVl = useRef(0)

  useFrame((_, delta) => {
    elapsedRef.current += delta

    if (elapsedRef.current >= CYCLE[idxRef.current].dur) {
      elapsedRef.current = 0
      idxRef.current = (idxRef.current + 1) % CYCLE.length
      const newName = CYCLE[idxRef.current].name
      if (newName !== prevName.current) {
        prevName.current = newName
        setActiveName(newName)   // triggers React re-render → correct `active` props
        onActiveChange(newName)  // update HTML label overlay
      }
    }

    // Spring the blob bulge strength
    const dt  = Math.min(delta, 0.05)
    const cur = CYCLE[idxRef.current].name
    const tgt = cur ? 1 : 0
    sVl.current += (tgt - sSc.current) * 10 * dt
    sVl.current -= sVl.current * 6.5 * dt
    sSc.current = Math.max(0, sSc.current + sVl.current * dt)

    // Write spawn state for MorphingBlob to read
    if (spawnStateRef) {
      const sp = SPAWN_MAP[cur]
      if (sp) spawnStateRef.current.dir.copy(sp).normalize()
      else    spawnStateRef.current.dir.set(0, 1, 0) // neutral upward when idle
      spawnStateRef.current.strength = sSc.current
    }
  })

  return (
    <group>
      <Chair        active={activeName === 'chair'}   />
      <FloorLamp    active={activeName === 'lamp'}    />
      <SideTable    active={activeName === 'table'}   />
      <Plant        active={activeName === 'plant'}   />
      <PendantLight active={activeName === 'pendant'} />
      <Bookshelf    active={activeName === 'shelf'}   />
    </group>
  )
}
