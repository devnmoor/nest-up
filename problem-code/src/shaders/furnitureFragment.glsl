// Furniture fragment shader — diffuse + strong fresnel rim glow, additive blending
uniform float uOpacity;
varying vec3  vNormal;
varying float vFresnel;

void main() {
  vec3  lDir  = normalize(vec3(0.5, 0.85, 0.65));
  float diff  = max(dot(normalize(vNormal), lDir), 0.0);

  float core  = 0.05 + diff * 0.95;
  float rim   = vFresnel * 1.3;       // softer edge glow — was 2.4

  vec3  col   = vec3(core + rim);
  float alpha = uOpacity * (0.18 + vFresnel * 0.82);

  gl_FragColor = vec4(col, alpha);
}
