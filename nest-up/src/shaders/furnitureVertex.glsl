// Furniture vertex shader — subtle breathing + fresnel for all furniture pieces
uniform float uTime;
varying vec3  vNormal;
varying float vFresnel;

void main() {
  // Very subtle alive breathing — furniture must stay recognisable
  float breathe = sin(uTime * 0.5  + position.y * 2.5) * 0.007
                + sin(uTime * 0.31 + position.x * 1.8) * 0.004;
  vec3 pos = position + normal * breathe;

  vec4 mvPos    = modelViewMatrix * vec4(pos, 1.0);
  vec3 viewDir  = normalize(-mvPos.xyz);
  vec3 viewNorm = normalize(normalMatrix * normal);

  vFresnel    = pow(1.0 - max(dot(viewNorm, viewDir), 0.0), 2.6);
  vNormal     = viewNorm;
  gl_Position = projectionMatrix * mvPos;
}
