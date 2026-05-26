// Blob vertex shader v3 — clean idle deformation + spawn bulge + spring mouse
uniform float uTime;
uniform float uScale;
uniform vec2  uMouse;
uniform vec2  uMouseVel;
uniform vec3  uSpawnDir;      // normalised direction toward active furniture
uniform float uSpawnStrength; // [0..1] spring scale of active furniture

varying vec3  vNormal;
varying vec3  vPosition;
varying float vFresnel;

// ── Simplex 3D noise ──────────────────────────────────────────────────────────
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute4(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 tInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute4(permute4(permute4(
    i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=tInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  float t = uTime;
  vec3  d = normalize(position);

  // Large-form idle noise — 2 octaves only, low frequency
  float n1   = snoise(d * 0.72 + vec3(t * 0.13)) * 0.11;
  float n2   = snoise(d * 1.6  + vec3(3.7, t * 0.07, 0.)) * 0.028;
  float breath = sin(t * 0.37) * 0.048 + sin(t * 0.19 + 1.4) * 0.022;
  float r    = uScale + breath + n1 + n2;

  // Directional bulge toward active furniture — organic neck/connection
  if(uSpawnStrength > 0.001){
    vec3  sd  = normalize(uSpawnDir);
    float aln = max(0., dot(d, sd));
    // pow(3) = wider lobe, 0.55 = stronger neck toward furniture
    r += pow(aln, 3.) * uSpawnStrength * 0.55;
  }

  // Spring mouse pull
  float mz   = sqrt(max(0.01, 1. - dot(uMouse, uMouse) * 0.55));
  vec3  mDir = normalize(vec3(uMouse, mz));
  float cdot = max(0., dot(d, mDir));
  float prox = cdot * cdot * cdot;
  vec3  pull = (mDir - d) * prox * 0.25;

  // Velocity drag
  float spd  = length(uMouseVel);
  vec3  drag = vec3(-uMouseVel, 0.) * prox * min(spd * 3., 0.55);

  vec3 displaced = d * r + pull + drag;

  vec3 cam = normalize(cameraPosition - displaced);
  vFresnel  = pow(1. - max(dot(normal, cam), 0.), 3.0);
  vNormal   = normalMatrix * normal;
  vPosition = displaced;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.);
}
