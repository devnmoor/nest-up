// Factory: creates solid + wireframe ShaderMaterial pair for furniture
import * as THREE from 'three'
import furnVert from '../../shaders/furnitureVertex.glsl?raw'
import furnFrag from '../../shaders/furnitureFragment.glsl?raw'

export function makeFurnMats(solidOpacity = 0.10, wireOpacity = 0.26) {
  const sU = { uTime: { value: 0 }, uOpacity: { value: solidOpacity } }
  const wU = { uTime: { value: 0 }, uOpacity: { value: wireOpacity } }
  const base = {
    vertexShader:   furnVert,
    fragmentShader: furnFrag,
    transparent:    true,
    depthWrite:     false,
    side:           THREE.DoubleSide,
    blending:       THREE.AdditiveBlending,
  }
  return {
    solid: new THREE.ShaderMaterial({ ...base, uniforms: sU }),
    wire:  new THREE.ShaderMaterial({ ...base, uniforms: wU, wireframe: true }),
    sU,
    wU,
  }
}
