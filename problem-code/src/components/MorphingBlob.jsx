import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import blobVertGLSL from '../shaders/blobVertex.glsl?raw'
import blobFragGLSL from '../shaders/blobFragment.glsl?raw'

// Spring constants: underdamped (ζ ≈ 0.69) → buttery inertial feel
const SPRING_K = 16.0
const SPRING_B = 5.5

// ── Single layered blob shell ─────────────────────────────────────────────────
function BlobShell({ scale, opacity, noiseOff, speed, sharedRef, primary }) {
  const solidRef = useRef()
  const wireRef  = useRef()

  const uniforms = useMemo(() => ({
    uTime:          { value: 0 },
    uScale:         { value: scale },
    uMouse:         { value: new THREE.Vector2() },
    uMouseVel:      { value: new THREE.Vector2() },
    uSpawnDir:      { value: new THREE.Vector3(0, 1, 0) },
    uSpawnStrength: { value: 0 },
    uOpacity:       { value: opacity },
  }), []) // eslint-disable-line

  const solidGeo = useMemo(() => new THREE.IcosahedronGeometry(1.0, 36), [])
  const wireGeo  = useMemo(() => new THREE.IcosahedronGeometry(1.0, 14), [])

  const solidMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: blobVertGLSL, fragmentShader: blobFragGLSL,
    uniforms,
    transparent: true, depthWrite: false,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  }), [uniforms])

  const wireMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: blobVertGLSL, fragmentShader: blobFragGLSL,
    uniforms,
    transparent: true, depthWrite: false,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    wireframe: true,
  }), [uniforms])

  useFrame((state, delta) => {
    const t  = state.clock.elapsedTime * speed + noiseOff
    uniforms.uTime.value = t

    // Spring physics (only primary shell computes; others read shared state)
    if (primary) {
      const sh = sharedRef.current
      const dt = Math.min(delta, 0.05)

      sh.springVel.x += (sh.rawMouse.x - sh.smoothMouse.x) * SPRING_K * dt
      sh.springVel.y += (sh.rawMouse.y - sh.smoothMouse.y) * SPRING_K * dt
      sh.springVel.x -= sh.springVel.x * SPRING_B * dt
      sh.springVel.y -= sh.springVel.y * SPRING_B * dt
      sh.smoothMouse.x += sh.springVel.x * dt
      sh.smoothMouse.y += sh.springVel.y * dt
      sh.smoothVel.lerp(sh.springVel, 0.09)
    }

    const sh = sharedRef.current
    uniforms.uMouse.value.copy(sh.smoothMouse)
    uniforms.uMouseVel.value.copy(sh.smoothVel)
    uniforms.uSpawnDir.value.copy(sh.spawnDir)
    uniforms.uSpawnStrength.value = sh.spawnStrength

    // Slow ambient rotation
    const rot = delta * 0.035 * speed
    if (solidRef.current) solidRef.current.rotation.y += rot
    if (wireRef.current)  wireRef.current.rotation.y  += rot
  })

  return (
    <group scale={scale}>
      <mesh ref={solidRef} geometry={solidGeo} material={solidMat} />
      <mesh ref={wireRef}  geometry={wireGeo}  material={wireMat}  />
    </group>
  )
}

// ── Root blob system ──────────────────────────────────────────────────────────
export default function MorphingBlob({ spawnStateRef }) {
  const sharedRef = useRef({
    rawMouse:    new THREE.Vector2(),
    smoothMouse: new THREE.Vector2(),
    springVel:   new THREE.Vector2(),
    smoothVel:   new THREE.Vector2(),
    spawnDir:    new THREE.Vector3(0, 1, 0),
    spawnStrength: 0,
  })

  // Sync spawn state from FurnitureSystem each frame via the shared ref
  useFrame(() => {
    if (spawnStateRef?.current) {
      sharedRef.current.spawnDir.copy(spawnStateRef.current.dir)
      sharedRef.current.spawnStrength = spawnStateRef.current.strength
    }
  })

  useEffect(() => {
    const onMove = e => {
      sharedRef.current.rawMouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
      sharedRef.current.rawMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <group>
      <BlobShell scale={1.00} opacity={0.15} noiseOff={0.0} speed={1.0}  sharedRef={sharedRef} primary={true}  />
      <BlobShell scale={1.07} opacity={0.08} noiseOff={2.4} speed={0.88} sharedRef={sharedRef} primary={false} />
      <BlobShell scale={1.15} opacity={0.04} noiseOff={5.2} speed={0.73} sharedRef={sharedRef} primary={false} />
    </group>
  )
}
