/* forestFoliageSkyFragmentShader — version statique */
precision highp float;
varying vec3 vWorldPos;
uniform float uDensity;
uniform float uLight;
uniform float uScale;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = vec2(atan(vWorldPos.z, vWorldPos.x) / 6.2832 + 0.5,
                 vWorldPos.y * 0.5 + 0.5);

  float n1 = fbm(uv * uScale * uDensity);
  float n2 = fbm(uv * uScale * uDensity * 1.7 + vec2(5.3, 1.7));
  float n3 = fbm(uv * uScale * uDensity * 2.8 + vec2(2.1, 8.4));

  float leaves = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  float mask = smoothstep((1.0 - uLight) - 0.12, (1.0 - uLight) + 0.12, leaves);

  vec3 darkLeaf  = vec3(0.02, 0.12, 0.03);
  vec3 midLeaf   = vec3(0.05, 0.22, 0.06);
  vec3 lightLeaf = vec3(0.10, 0.38, 0.10);
  vec3 skyPeek   = vec3(0.38, 0.62, 0.72);
  vec3 sunPeek   = vec3(0.82, 0.88, 0.60);

  vec3 leafColor = mix(darkLeaf, mix(midLeaf, lightLeaf, n2), n3);
  vec3 gapColor  = mix(skyPeek, sunPeek, pow(n1, 3.0));

  leafColor = mix(leafColor * 0.55, leafColor, vWorldPos.y * 0.5 + 0.5);

  gl_FragColor = vec4(mix(gapColor, leafColor, mask), 1.0);
}