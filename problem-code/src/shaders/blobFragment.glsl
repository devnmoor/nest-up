// Blob fragment shader v3
uniform float uOpacity;

varying vec3  vNormal;
varying vec3  vPosition;
varying float vFresnel;

void main(){
  vec3  lDir  = normalize(vec3(0.55, 1.0, 0.7));
  float diff  = max(dot(normalize(vNormal), lDir), 0.);
  float lum   = 0.06 + diff * 0.94;
  float rim   = vFresnel * 1.1;          // softer rim — was 1.9
  float fog   = 1. - smoothstep(1.2, 4.5, length(vPosition)) * 0.45;
  vec3  col   = vec3(lum) + vec3(rim);
  float alpha = uOpacity * (0.22 + vFresnel * 0.78);
  gl_FragColor = vec4(col * fog, alpha);
}
