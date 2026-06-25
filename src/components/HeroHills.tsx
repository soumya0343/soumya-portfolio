import { useEffect, useRef } from "react";
import * as THREE from "three";

/* GLSL animated hills hero background, ported from hills.js. */

const VERTEX = `
  #define GLSLIFY 1
  attribute vec3 position;
  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;
  uniform float time;
  varying vec3 vPosition;

  mat4 rotateMatrixX(float radian) {
    return mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, cos(radian), -sin(radian), 0.0,
      0.0, sin(radian),  cos(radian), 0.0,
      0.0, 0.0, 0.0, 1.0
    );
  }

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod289(Pi0); Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
    vec4 ixy  = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x); vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z); vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x); vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z); vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
    g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
    g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z  = mix(vec4(n000,n100,n010,n110), vec4(n001,n101,n011,n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  void main(void) {
    vec3 up = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz;
    float s1 = sin(radians(up.x / 128.0 * 90.0));
    vec3 np = up + vec3(0.0, 0.0, time * -30.0);
    float n1 = cnoise(np * 0.08);
    float n2 = cnoise(np * 0.06);
    float n3 = cnoise(np * 0.4);
    vec3 lp = up + vec3(0.0,
      n1 * s1 * 8.0 + n2 * s1 * 8.0 + n3 * (abs(s1) * 2.0 + 0.5) + pow(s1, 2.0) * 40.0,
      0.0);
    vPosition = lp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(lp, 1.0);
  }
`;

const FRAGMENT = `
  precision highp float;
  #define GLSLIFY 1
  varying vec3 vPosition;
  uniform vec3 uColor;
  void main(void) {
    float opacity = (96.0 - length(vPosition)) / 256.0 * 0.7;
    gl_FragColor = vec4(uColor, opacity);
  }
`;

// Hill red per theme, darker, deeper red in light mode for contrast against the pale page.
const COLOR_DARK = new THREE.Vector3(0.9, 0.22, 0.23);
const COLOR_LIGHT = new THREE.Vector3(0.62, 0.1, 0.12);
const hillColor = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? COLOR_LIGHT : COLOR_DARK;

export default function HeroHills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const PLANE_SIZE = 256;
    const SPEED = 0.5;
    const CAMERA_Z = 125;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    } catch {
      // No WebGL (some browsers / headless sandboxes), skip the background, keep the page alive.
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 16, CAMERA_Z);
    camera.lookAt(new THREE.Vector3(0, 28, 0));

    const clock = new THREE.Clock();
    const uniforms = { time: { value: 0 }, uColor: { value: hillColor().clone() } };

    // Re-tint when the user toggles light/dark.
    const themeObserver = new MutationObserver(() => {
      uniforms.uColor.value.copy(hillColor());
      if (!running) renderer.render(scene, camera); // refresh even while paused
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, PLANE_SIZE, PLANE_SIZE), material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    let rafId = 0;
    let running = true;

    const loop = () => {
      if (!running) return;
      uniforms.time.value += clock.getDelta() * SPEED;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!reduce) {
        running = true;
        clock.getDelta(); // discard paused delta
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) {
      uniforms.time.value = 2;
      renderer.render(scene, camera);
    } else {
      loop();
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="hero__hills" id="heroHills" ref={canvasRef} aria-hidden="true" />;
}
