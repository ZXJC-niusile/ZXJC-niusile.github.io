/**
 * GLSL 着色器 - System B 粒子系统
 */

// 共用噪声函数
const NOISE_GLSL = `
// MATHS
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}

vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

// Simplex 2D noise
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
          -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Simplex 3D noise
float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Simplex 4D noise
vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract(vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2(0.138196601125010504, 0.309016994374947451);

  vec4 i  = floor(v + dot(v, C.yyyy));
  vec4 x0 = v - i + dot(i, C.xxxx);

  vec4 i0;

  vec3 isX = step(x0.yzw, x0.xxx);
  vec3 isYZ = step(x0.zww, x0.yyz);

  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  vec4 i3 = clamp(i0, 0.0, 1.0);
  vec4 i2 = clamp(i0 - 1.0, 0.0, 1.0);
  vec4 i1 = clamp(i0 - 2.0, 0.0, 1.0);

  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0);
  float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute(permute(permute(permute(
            i.w + vec4(i1.w, i2.w, i3.w, 1.0))
          + i.z + vec4(i1.z, i2.z, i3.z, 1.0))
          + i.y + vec4(i1.y, i2.y, i3.y, 1.0))
          + i.x + vec4(i1.x, i2.x, i3.x, 1.0));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);

  vec4 p0 = grad4(j0, ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * (dot(m0*m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)))
               + dot(m1*m1, vec2(dot(p3, x3), dot(p4, x4))));
}
`;

// Simulation Vertex Shader
export const SIM_VERTEX_SHADER = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

// Simulation Fragment Shader
export const SIM_FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uPosition;
uniform sampler2D uPosRefs;
uniform vec2 uRingPos;
uniform float uTime;
uniform float uDeltaTime;
uniform float uRingRadius;

uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uRingDisplacement;

${NOISE_GLSL}

void main() {
  vec2 simTexCoords = gl_FragCoord.xy / vec2(256.0, 256.0);
  vec4 pFrame = texture2D(uPosition, simTexCoords);

  float scale = pFrame.z;
  float velocity = pFrame.w;
  vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;

  float time = uTime * .5;
  vec2 currentPos = refPos;

  vec2 pos = pFrame.xy;
  pos *= .8;

  float dist = distance(currentPos.xy, uRingPos);
  float noise0 = snoise(vec3(currentPos.xy * .2 + vec2(18.4924, 72.9744), time * 0.5));
  float dist1 = distance(currentPos.xy + (noise0 * .005), uRingPos);

  float t = smoothstep(uRingRadius - (uRingWidth * 2.), uRingRadius, dist)
          - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
  float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.), uRingRadius, dist)
           - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
  float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

  t = pow(t, 2.);
  t2 = pow(t2, 3.);

  t += t2 * 3.;
  t += t3 * .4;
  t += snoise(vec3(currentPos.xy * 30. + vec2(11.4924, 12.9744), time * 0.5)) * t3 * .5;

  float nS = snoise(vec3(currentPos.xy * 2. + vec2(18.4924, 72.9744), time * 0.5));
  t += pow((nS + 1.5) * .5, 2.) * .6;

  float noise1 = snoise(vec3(currentPos.xy * 4. + vec2(88.494, 32.4397), time * 0.35));
  float noise2 = snoise(vec3(currentPos.xy * 4. + vec2(50.904, 120.947), time * 0.35));

  float noise3 = snoise(vec3(currentPos.xy * 20. + vec2(18.4924, 72.9744), time * .5));
  float noise4 = snoise(vec3(currentPos.xy * 20. + vec2(50.904, 120.947), time * .5));

  vec2 disp = vec2(noise1, noise2) * .03;
  disp += vec2(noise3, noise4) * .005;

  disp.x += sin((refPos.x * 20.) + (time * 4.)) * .02 * clamp(dist, 0., 1.);
  disp.y += cos((refPos.y * 20.) + (time * 3.)) * .02 * clamp(dist, 0., 1.);

  pos -= (uRingPos - (currentPos + disp)) * pow(t2, .75) * uRingDisplacement;

  float scaleDiff = t - scale;
  scaleDiff *= .2;
  scale += scaleDiff;

  vec2 finalPos = currentPos + disp + (pos * .25);

  velocity *= .5;
  velocity += scale * .25;

  vec4 frame = vec4(finalPos, scale, velocity);
  gl_FragColor = frame;
}
`;

// Render Vertex Shader
export const RENDER_VERTEX_SHADER = `
precision highp float;
attribute vec4 seeds;

uniform sampler2D uPosition;
uniform float uTime;
uniform float uParticleScale;
uniform float uPixelRatio;
uniform int uColorScheme;

varying vec4 vSeeds;
varying float vVelocity;
varying vec2 vLocalPos;
varying vec2 vScreenPos;
varying float vScale;

void main() {
  vec4 pos = texture2D(uPosition, uv);
  vSeeds = seeds;

  vVelocity = pos.w;
  vScale = pos.z;
  vLocalPos = pos.xy;

  vec4 viewSpace = modelViewMatrix * vec4(vec3(pos.xy, 0.0), 1.0);
  gl_Position = projectionMatrix * viewSpace;
  vScreenPos = gl_Position.xy;

  gl_PointSize = ((vScale * 7.0) * (uPixelRatio * 0.5) * uParticleScale);
}
`;

// Render Fragment Shader
export const RENDER_FRAGMENT_SHADER = `
precision highp float;

varying vec4 vSeeds;
varying vec2 vScreenPos;
varying vec2 vLocalPos;
varying float vScale;
varying float vVelocity;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

uniform vec2 uRingPos;
uniform vec2 uRez;

uniform float uAlpha;
uniform float uTime;

uniform int uColorScheme;

${NOISE_GLSL}

#define PI 3.1415926535897932384626433832795

float sdRoundBox(in vec2 p, in vec2 b, in vec4 r) {
  r.xy = (p.x > 0.0) ? r.xy : r.zw;
  r.x  = (p.y > 0.0) ? r.x  : r.y;
  vec2 q = abs(p) - b + r.x;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

void main() {
  float uBorderSize = 0.2;
  vec2 center = vec2(.48, .4);
  float ratio = uRez.x / uRez.y;

  float noiseAngle = snoise(vec3(vLocalPos * 10. + vec2(18.4924, 72.9744), uTime * .85));
  float noiseColor = snoise(vec3(vLocalPos * 2. + vec2(74.664, 91.556), uTime * .5));
  noiseColor = (noiseColor + 1.) * .5;

  float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

  vec2 uv = gl_PointCoord.xy;
  uv -= vec2(0.5);
  uv.y *= -1.;
  uv = rotate(uv, -angle + (noiseAngle * .5));

  vec2 tuv = vScreenPos;
  tuv = rotate(tuv, uTime * 1.);
  tuv.y *= 1. / ratio;
  tuv += .5;

  float h = 0.8;
  float progress = smoothstep(0., .75, pow(noiseColor, 2.));
  vec3 col = mix(
    mix(uColor1, uColor2, progress / h),
    mix(uColor2, uColor3, (progress - h) / (1.0 - h)),
    step(h, progress)
  );
  vec3 color = col;

  float dist = sqrt(dot(uv, uv));

  float dr = .5;
  float t = smoothstep(dr + (uBorderSize + .0001), dr - uBorderSize, dist);
  t = clamp(t, 0., 1.);

  float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(.25));
  rounded = smoothstep(.1, 0., rounded);

  float a = uAlpha * rounded * smoothstep(0.1, 0.2, vScale);

  if (a < 0.01) {
    discard;
  }

  color = clamp(color, 0., 1.);
  color = mix(color, color * clamp(vVelocity, 0., 1.), float(uColorScheme));

  gl_FragColor = vec4(color, clamp(a, 0., 1.));

  #ifdef SRGB_TRANSFER
    gl_FragColor = sRGBTransferOETF(gl_FragColor);
  #endif
}
`;
