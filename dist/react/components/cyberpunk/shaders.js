/**
 * Cyberpunk 3D Terminal - Custom GLSL Shaders
 *
 * Holographic damage effects, scan lines, and flickering
 * Night City salvage aesthetic - damaged but functional
 */
// Vertex shader with damage displacement
export const hologramVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDamageIntensity;
  uniform float uGlitchIntensity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vGlitch;

  // Simplex noise for organic damage
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

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;

    // Damage warping - subtle displacement based on noise
    float damageNoise = snoise(vec3(pos.xy * 2.0, uTime * 0.1)) * uDamageIntensity;
    pos.z += damageNoise * 0.05;

    // Edge damage - more warping at corners
    float edgeFactor = pow(max(abs(uv.x - 0.5), abs(uv.y - 0.5)) * 2.0, 2.0);
    pos.z += edgeFactor * damageNoise * 0.03;

    // Glitch displacement - random horizontal tears
    float glitchTrigger = step(0.97, fract(sin(floor(uTime * 15.0) * 12.9898) * 43758.5453));
    float glitchLine = step(0.98, fract(uv.y * 20.0 + uTime * 3.0));
    float glitch = glitchTrigger * glitchLine * uGlitchIntensity;
    pos.x += glitch * (fract(sin(uTime * 100.0) * 43758.5453) - 0.5) * 0.2;

    vGlitch = glitch;
    vPosition = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
// Fragment shader with holographic effects
export const hologramFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScanlineIntensity;
  uniform float uFlickerIntensity;
  uniform float uDamageIntensity;
  uniform vec3 uPrimaryColor;    // Cyan #00ffff
  uniform vec3 uAccentColor;     // Magenta #ff0080
  uniform vec3 uBackgroundColor; // Deep dark #0a0a12
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vGlitch;

  // Random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // Base color - gradient from background to transparent
    vec3 baseColor = uBackgroundColor;

    // Scan lines - horizontal bands
    float scanline = sin(uv.y * 400.0 + uTime * 2.0) * 0.5 + 0.5;
    scanline = pow(scanline, 4.0) * uScanlineIntensity;

    // Secondary scan lines - slower, thicker
    float scanline2 = sin(uv.y * 100.0 - uTime * 0.5) * 0.5 + 0.5;
    scanline2 = pow(scanline2, 8.0) * 0.3 * uScanlineIntensity;

    // Flicker effect - random brightness variation
    float flicker = 1.0 - random(vec2(floor(uTime * 30.0), 0.0)) * uFlickerIntensity * 0.15;

    // Edge glow - stronger at edges
    float edgeGlow = 1.0 - pow(1.0 - max(abs(uv.x - 0.5) * 2.0, abs(uv.y - 0.5) * 2.0), 3.0);
    vec3 glowColor = mix(uPrimaryColor, uAccentColor, uv.x);

    // Corner damage zones - darker, more static
    float cornerDamage = pow(max(abs(uv.x - 0.5), abs(uv.y - 0.5)) * 2.0, 4.0);
    float damageNoise = random(uv * 100.0 + floor(uTime * 2.0)) * cornerDamage * uDamageIntensity;

    // Chromatic aberration on glitch
    float aberration = vGlitch * 0.02;

    // Combine effects
    vec3 finalColor = baseColor;

    // Add scan line effect
    finalColor += glowColor * scanline * 0.1;
    finalColor += uAccentColor * scanline2 * 0.05;

    // Add edge glow
    finalColor += glowColor * edgeGlow * 0.3;

    // Add flicker
    finalColor *= flicker;

    // Subtract damage darkness
    finalColor -= vec3(damageNoise * 0.5);

    // Glitch color shift
    if (vGlitch > 0.5) {
      finalColor.r += 0.2;
      finalColor.b -= 0.1;
    }

    // Calculate opacity - more transparent in center, more solid at edges
    float alpha = mix(0.6, 0.9, edgeGlow) * uOpacity;
    alpha *= flicker;

    // Ensure minimum visibility
    finalColor = max(finalColor, uBackgroundColor * 0.3);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
// Post-processing scanline shader (for EffectComposer)
export const scanlineShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uScanlineCount: { value: 800.0 },
        uScanlineIntensity: { value: 0.15 },
        uNoiseIntensity: { value: 0.08 },
        uFlickerSpeed: { value: 15.0 },
    },
    vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uScanlineCount;
    uniform float uScanlineIntensity;
    uniform float uNoiseIntensity;
    uniform float uFlickerSpeed;

    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // Scan lines
      float scanline = sin(vUv.y * uScanlineCount) * 0.5 + 0.5;
      scanline = 1.0 - pow(scanline, 2.0) * uScanlineIntensity;

      // Film grain / noise
      float noise = random(vUv + fract(uTime)) * uNoiseIntensity;

      // Global flicker
      float flicker = 1.0 - random(vec2(floor(uTime * uFlickerSpeed), 0.0)) * 0.03;

      // Apply effects
      color.rgb *= scanline;
      color.rgb += noise - uNoiseIntensity * 0.5;
      color.rgb *= flicker;

      gl_FragColor = color;
    }
  `,
};
// Color constants (matching CSS variables)
export const CYBERPUNK_COLORS = {
    primary: [0, 1, 1], // #00ffff - Cyan
    accent: [1, 0, 0.5], // #ff0080 - Magenta
    bgDeep: [0.039, 0.039, 0.071], // #0a0a12
    bgSurface: [0.071, 0.071, 0.122], // #12121f
    textPrimary: [0.878, 0.878, 1], // #e0e0ff
};
//# sourceMappingURL=shaders.js.map