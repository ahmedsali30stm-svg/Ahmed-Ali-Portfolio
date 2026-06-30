export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;

  attribute float aSize;

  varying float vDistance;
  varying float vPulse;

  // Simplex noise helper
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;

    // Organic breathing motion
    float noise = snoise(pos * 0.3 + uTime * 0.15);
    pos += normalize(pos) * noise * 0.12;

    // Subtle wave ripple
    float wave = sin(pos.x * 2.0 + uTime * 0.4) * 0.05;
    pos.y += wave;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Distance-based fade
    vDistance = -mvPosition.z;

    // Pulsing glow
    vPulse = 0.5 + 0.5 * sin(uTime * 1.2 + length(position) * 0.5);

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * (180.0 / -mvPosition.z);
  }
`;

export const particleFragmentShader = /* glsl */ `
  uniform float uTime;

  varying float vDistance;
  varying float vPulse;

  void main() {
    // Circular point shape
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Soft edge falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

    // Gold core -> amber edge gradient
    vec3 coreColor = vec3(1.0, 0.84, 0.0);      // Pure gold
    vec3 midColor  = vec3(0.95, 0.65, 0.1);     // Amber
    vec3 edgeColor = vec3(0.8, 0.3, 0.05);      // Deep amber

    vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.3, dist));
    color = mix(color, edgeColor, smoothstep(0.3, 0.5, dist));

    // Bioluminescent pulse
    float pulse = 0.7 + 0.3 * vPulse;
    color *= pulse;

    // Distance fog
    float fogFactor = 1.0 - smoothstep(3.0, 12.0, vDistance);
    alpha *= fogFactor;

    // Boost core brightness
    alpha *= (1.0 - dist * 0.4);

    gl_FragColor = vec4(color, alpha * 0.75);
  }
`;
