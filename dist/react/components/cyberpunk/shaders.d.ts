/**
 * Cyberpunk 3D Terminal - Custom GLSL Shaders
 *
 * Holographic damage effects, scan lines, and flickering
 * Night City salvage aesthetic - damaged but functional
 */
export declare const hologramVertexShader = "\n  uniform float uTime;\n  uniform float uDamageIntensity;\n  uniform float uGlitchIntensity;\n\n  varying vec2 vUv;\n  varying vec3 vNormal;\n  varying vec3 vPosition;\n  varying float vGlitch;\n\n  // Simplex noise for organic damage\n  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\n  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\n  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }\n  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\n\n  float snoise(vec3 v) {\n    const vec2 C = vec2(1.0/6.0, 1.0/3.0);\n    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n\n    vec3 i = floor(v + dot(v, C.yyy));\n    vec3 x0 = v - i + dot(i, C.xxx);\n\n    vec3 g = step(x0.yzx, x0.xyz);\n    vec3 l = 1.0 - g;\n    vec3 i1 = min(g.xyz, l.zxy);\n    vec3 i2 = max(g.xyz, l.zxy);\n\n    vec3 x1 = x0 - i1 + C.xxx;\n    vec3 x2 = x0 - i2 + C.yyy;\n    vec3 x3 = x0 - D.yyy;\n\n    i = mod289(i);\n    vec4 p = permute(permute(permute(\n      i.z + vec4(0.0, i1.z, i2.z, 1.0))\n      + i.y + vec4(0.0, i1.y, i2.y, 1.0))\n      + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n\n    float n_ = 0.142857142857;\n    vec3 ns = n_ * D.wyz - D.xzx;\n\n    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);\n\n    vec4 x_ = floor(j * ns.z);\n    vec4 y_ = floor(j - 7.0 * x_);\n\n    vec4 x = x_ * ns.x + ns.yyyy;\n    vec4 y = y_ * ns.x + ns.yyyy;\n    vec4 h = 1.0 - abs(x) - abs(y);\n\n    vec4 b0 = vec4(x.xy, y.xy);\n    vec4 b1 = vec4(x.zw, y.zw);\n\n    vec4 s0 = floor(b0) * 2.0 + 1.0;\n    vec4 s1 = floor(b1) * 2.0 + 1.0;\n    vec4 sh = -step(h, vec4(0.0));\n\n    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n    vec3 p0 = vec3(a0.xy, h.x);\n    vec3 p1 = vec3(a0.zw, h.y);\n    vec3 p2 = vec3(a1.xy, h.z);\n    vec3 p3 = vec3(a1.zw, h.w);\n\n    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n    p0 *= norm.x;\n    p1 *= norm.y;\n    p2 *= norm.z;\n    p3 *= norm.w;\n\n    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n    m = m * m;\n    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));\n  }\n\n  void main() {\n    vUv = uv;\n    vNormal = normalize(normalMatrix * normal);\n\n    vec3 pos = position;\n\n    // Damage warping - subtle displacement based on noise\n    float damageNoise = snoise(vec3(pos.xy * 2.0, uTime * 0.1)) * uDamageIntensity;\n    pos.z += damageNoise * 0.05;\n\n    // Edge damage - more warping at corners\n    float edgeFactor = pow(max(abs(uv.x - 0.5), abs(uv.y - 0.5)) * 2.0, 2.0);\n    pos.z += edgeFactor * damageNoise * 0.03;\n\n    // Glitch displacement - random horizontal tears\n    float glitchTrigger = step(0.97, fract(sin(floor(uTime * 15.0) * 12.9898) * 43758.5453));\n    float glitchLine = step(0.98, fract(uv.y * 20.0 + uTime * 3.0));\n    float glitch = glitchTrigger * glitchLine * uGlitchIntensity;\n    pos.x += glitch * (fract(sin(uTime * 100.0) * 43758.5453) - 0.5) * 0.2;\n\n    vGlitch = glitch;\n    vPosition = pos;\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n  }\n";
export declare const hologramFragmentShader = "\n  uniform float uTime;\n  uniform float uScanlineIntensity;\n  uniform float uFlickerIntensity;\n  uniform float uDamageIntensity;\n  uniform vec3 uPrimaryColor;    // Cyan #00ffff\n  uniform vec3 uAccentColor;     // Magenta #ff0080\n  uniform vec3 uBackgroundColor; // Deep dark #0a0a12\n  uniform float uOpacity;\n\n  varying vec2 vUv;\n  varying vec3 vNormal;\n  varying vec3 vPosition;\n  varying float vGlitch;\n\n  // Random function\n  float random(vec2 st) {\n    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);\n  }\n\n  void main() {\n    vec2 uv = vUv;\n\n    // Base color - gradient from background to transparent\n    vec3 baseColor = uBackgroundColor;\n\n    // Scan lines - horizontal bands\n    float scanline = sin(uv.y * 400.0 + uTime * 2.0) * 0.5 + 0.5;\n    scanline = pow(scanline, 4.0) * uScanlineIntensity;\n\n    // Secondary scan lines - slower, thicker\n    float scanline2 = sin(uv.y * 100.0 - uTime * 0.5) * 0.5 + 0.5;\n    scanline2 = pow(scanline2, 8.0) * 0.3 * uScanlineIntensity;\n\n    // Flicker effect - random brightness variation\n    float flicker = 1.0 - random(vec2(floor(uTime * 30.0), 0.0)) * uFlickerIntensity * 0.15;\n\n    // Edge glow - stronger at edges\n    float edgeGlow = 1.0 - pow(1.0 - max(abs(uv.x - 0.5) * 2.0, abs(uv.y - 0.5) * 2.0), 3.0);\n    vec3 glowColor = mix(uPrimaryColor, uAccentColor, uv.x);\n\n    // Corner damage zones - darker, more static\n    float cornerDamage = pow(max(abs(uv.x - 0.5), abs(uv.y - 0.5)) * 2.0, 4.0);\n    float damageNoise = random(uv * 100.0 + floor(uTime * 2.0)) * cornerDamage * uDamageIntensity;\n\n    // Chromatic aberration on glitch\n    float aberration = vGlitch * 0.02;\n\n    // Combine effects\n    vec3 finalColor = baseColor;\n\n    // Add scan line effect\n    finalColor += glowColor * scanline * 0.1;\n    finalColor += uAccentColor * scanline2 * 0.05;\n\n    // Add edge glow\n    finalColor += glowColor * edgeGlow * 0.3;\n\n    // Add flicker\n    finalColor *= flicker;\n\n    // Subtract damage darkness\n    finalColor -= vec3(damageNoise * 0.5);\n\n    // Glitch color shift\n    if (vGlitch > 0.5) {\n      finalColor.r += 0.2;\n      finalColor.b -= 0.1;\n    }\n\n    // Calculate opacity - more transparent in center, more solid at edges\n    float alpha = mix(0.6, 0.9, edgeGlow) * uOpacity;\n    alpha *= flicker;\n\n    // Ensure minimum visibility\n    finalColor = max(finalColor, uBackgroundColor * 0.3);\n\n    gl_FragColor = vec4(finalColor, alpha);\n  }\n";
export declare const scanlineShader: {
    uniforms: {
        tDiffuse: {
            value: null;
        };
        uTime: {
            value: number;
        };
        uScanlineCount: {
            value: number;
        };
        uScanlineIntensity: {
            value: number;
        };
        uNoiseIntensity: {
            value: number;
        };
        uFlickerSpeed: {
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export declare const CYBERPUNK_COLORS: {
    primary: [number, number, number];
    accent: [number, number, number];
    bgDeep: [number, number, number];
    bgSurface: [number, number, number];
    textPrimary: [number, number, number];
};
//# sourceMappingURL=shaders.d.ts.map