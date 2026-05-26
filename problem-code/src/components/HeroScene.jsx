import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import MorphingBlob    from './MorphingBlob'
import FurnitureSystem from './FurnitureSystem'
import FurnitureHint   from './FurnitureHint'

export default function HeroScene() {
  const [activeName, setActiveName] = useState(null)

  // Shared ref: FurnitureSystem writes, MorphingBlob reads (zero React overhead)
  const spawnState = useRef({
    dir:      new THREE.Vector3(0, 1, 0),
    strength: 0,
  })

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>

      {/* ── Three.js Canvas ── */}
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.07} />
        <pointLight position={[3, 4, 3]} intensity={0.35} color="#e8e8ff" />
        <pointLight position={[-3, -2, 2]} intensity={0.12} color="#ffffff" />

        <Suspense fallback={null}>
          <MorphingBlob    spawnStateRef={spawnState} />
          <FurnitureSystem spawnStateRef={spawnState} onActiveChange={setActiveName} />

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.22}
              luminanceThreshold={0.30}
              luminanceSmoothing={0.85}
              blendFunction={BlendFunction.ADD}
              mipmapBlur
              radius={0.55}
            />
            <Vignette
              offset={0.30}
              darkness={0.65}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* ── HTML overlay ── */}
      {/* Nav */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '2rem 3rem', pointerEvents: 'none',
        }}
      >
        <span style={{
          fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 300,
          fontSize: '1.5rem', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.02em',
        }}>
          nest up
        </span>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 200, fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.4em', textTransform: 'uppercase',
        }}>
          your move-in guide
        </span>
      </motion.div>

      {/* Ghost headline (barely visible, lives behind furniture) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.0, ease: 'easeInOut', delay: 0.9 }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center', pointerEvents: 'none',
          mixBlendMode: 'overlay', userSelect: 'none',
        }}
      >
        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 300, fontStyle: 'italic',
          fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
          color: 'rgba(255,255,255,0.06)', letterSpacing: '-0.01em', lineHeight: 1.1,
        }}>
          Every space<br />finds its form.
        </h1>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
        style={{
          position: 'absolute', bottom: '3.5rem', left: '50%',
          transform: 'translateX(-50%)', pointerEvents: 'auto',
        }}
      >
        <button
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'Inter, sans-serif', fontWeight: 300,
            fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase',
            padding: '0.85rem 2.5rem', borderRadius: '999px', cursor: 'pointer',
            backdropFilter: 'blur(8px)', transition: 'all 0.4s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          Begin
        </button>
      </motion.div>

      {/* Furniture name label */}
      <FurnitureHint activeName={activeName} />
    </div>
  )
}
