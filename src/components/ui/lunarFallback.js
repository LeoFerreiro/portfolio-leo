import { LUNAR_VISUAL as V } from './lunarVisualConfig.js';

let mapsPromise;
let geometryCache;
const linear = new Float32Array(256).map((_, i) => {
  const c = i / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
});
async function readMap(url, maxWidth = 1024) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let bitmap;
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('Map unavailable');
    bitmap = await createImageBitmap(await response.blob());
  } finally { clearTimeout(timeout); }
  const canvas = document.createElement('canvas');
  canvas.width = Math.min(bitmap.width, maxWidth); canvas.height = Math.round(bitmap.height * canvas.width / bitmap.width);
  try {
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Canvas2D unavailable');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  } finally { bitmap.close(); canvas.width = canvas.height = 0; }
}
function maps() {
  if (!mapsPromise) mapsPromise = Promise.all([
    readMap('/hero/lunar/moon-color-1k.webp'), readMap('/hero/lunar/moon-bump-1k.webp', 512),
  ]).catch(() => { mapsPromise = undefined; return null; });
  return mapsPromise;
}
function pixel(map, px, py, color) {
  const i = (py * map.width + (px + map.width) % map.width) * 4;
  return color ? linear[map.data[i]] * 0.2126 + linear[map.data[i + 1]] * 0.7152 + linear[map.data[i + 2]] * 0.0722 : map.data[i] / 255;
}
function sample(map, u, v, color = false) {
  const x = ((u % 1 + 1) % 1) * map.width - 0.5;
  const y = Math.max(0, Math.min(map.height - 1, (1 - v) * map.height - 0.5));
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const next = Math.min(iy + 1, map.height - 1);
  const a = pixel(map, ix, iy, color) * (1 - fx) + pixel(map, ix + 1, iy, color) * fx;
  const b = pixel(map, ix, next, color) * (1 - fx) + pixel(map, ix + 1, next, color) * fx;
  return a * (1 - fy) + b * fy;
}
const cancelled = (signal) => { if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError'); };
async function yieldIfNeeded(start, signal, stats) {
  cancelled(signal);
  const elapsed = performance.now() - start;
  stats.maxBlockMs = Math.max(stats.maxBlockMs, elapsed);
  if (elapsed < 4.5) return start;
  await new Promise((resolve) => setTimeout(resolve, 0));
  cancelled(signal);
  return performance.now();
}
async function geometry(width, height, textures, signal, stats) {
  if (geometryCache?.width === width && geometryCache.textured === !!textures) return geometryCache;
  const normal = new Float32Array(width * height * 3);
  const albedo = new Float32Array(width * height).fill(-1);
  const radius = width * V.diameter / 2, cx = width * V.centerX, cy = height * V.centerY;
  const c = Math.cos(-V.baseZ), s = Math.sin(-V.baseZ);
  let block = performance.now();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let nx = (x + 0.5 - cx) / radius, ny = (cy - y - 0.5) / radius;
      const d = nx * nx + ny * ny;
      if (Math.sqrt(d) > 1 + 0.5 / radius) continue;
      if (d > 1) { const scale = Math.sqrt(d); nx /= scale; ny /= scale; }
      const nz = Math.sqrt(Math.max(0, 1 - d));
      // Inverse of the approved Ry(-pi/2) * Rz(-0.08) terrain pose.
      let lx = nz * c - ny * s, ly = nz * s + ny * c, lz = -nx;
      const theta = Math.acos(Math.max(-1, Math.min(1, ly)));
      const phi = Math.atan2(lz, -lx), u = ((phi / (2 * Math.PI)) % 1 + 1) % 1, v = 1 - theta / Math.PI;
      const i = y * width + x;
      albedo[i] = textures ? sample(textures[0], u, v, true) : 0.22;
      if (textures) {
        const map = textures[1], du = 1 / map.width, dv = 1 / map.height;
        const dhU = (sample(map, u + du, v) - sample(map, u - du, v)) / (2 * du) * V.bumpScale;
        const dhV = (sample(map, u, v + dv) - sample(map, u, v - dv)) / (2 * dv) * V.bumpScale;
        const sin = Math.max(0.05, Math.sin(theta)), cos = Math.cos(theta);
        // Approximate texture minification at the limb; avoid unresolved CPU bump speckle.
        const footprint = Math.min(1, nz / 0.25);
        const gu = dhU / (2 * Math.PI * sin) * footprint, gv = dhV / Math.PI * footprint;
        lx -= gu * Math.sin(phi) + gv * Math.cos(phi) * cos;
        ly -= gv * sin;
        lz -= gu * Math.cos(phi) - gv * Math.sin(phi) * cos;
      }
      const length = Math.hypot(lx, ly, lz);
      // Forward pose back into observer space.
      normal[i * 3] = -lz / length;
      normal[i * 3 + 1] = (-lx * s + ly * c) / length;
      normal[i * 3 + 2] = (lx * c + ly * s) / length;
    }
    block = await yieldIfNeeded(block, signal, stats);
  }
  cancelled(signal);
  geometryCache = { width, height, textured: !!textures, normal, albedo };
  return geometryCache;
}
function display(linearLight) {
  // Scalar ACES RRT/ODT fit for a neutral grayscale surface, then sRGB output.
  const x = linearLight * V.exposure / 0.6;
  const mapped = Math.max(0, Math.min(1, (x * (x + 0.0245786) - 0.000090537) / (x * (0.983729 * x + 0.432951) + 0.238081)));
  return Math.round(255 * (mapped <= 0.0031308 ? 12.92 * mapped : 1.055 * mapped ** (1 / 2.4) - 0.055));
}

/** Local CPU fallback, only on a shared phase update. No Three.js or WebGL needed. */
export async function renderLunarFallback(canvas, phase, { signal, width = 320 } = {}) {
  const start = performance.now();
  const textures = await maps();
  cancelled(signal);
  const cpuStart = performance.now();
  const stats = { maxBlockMs: 0 };
  const height = Math.round(width * 1598 / 1600);
  const data = await geometry(width, height, textures, signal, stats);
  const image = new ImageData(width, height);
  const [sx, sy, sz] = phase.solarDirection;
  const halfLength = Math.hypot(sx, sy, sz + 1);
  const hx = halfLength > 1e-8 ? sx / halfLength : 0, hy = halfLength > 1e-8 ? sy / halfLength : 0, hz = halfLength > 1e-8 ? (sz + 1) / halfLength : 1;
  const radius = width * V.diameter / 2;
  let block = performance.now();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x, a = data.albedo[i];
      if (a < 0) continue;
      const nx = data.normal[i * 3], ny = data.normal[i * 3 + 1], nz = data.normal[i * 3 + 2];
      const nl = Math.max(0, nx * sx + ny * sy + nz * sz);
      const nv = Math.max(0.001, nz), nh = Math.max(0, nx * hx + ny * hy + nz * hz);
      const vh = Math.max(0, hz);
      const fresnel = 0.04 + 0.96 * (1 - vh) ** 5;
      const specular = fresnel * 0.5 / (Math.PI * Math.max(0.001, nl + nv));
      // nh retained as a guard against invalid back-facing half vectors.
      const direct = V.sunIntensity * 0.90 * nl * (a * linear[217] / Math.PI + (nh > 0 ? specular : 0));
      const ambient = V.ambientIntensity * 0.75 * a * linear[217] / Math.PI;
      const value = display(direct + ambient);
      const pixel = i * 4;
      image.data[pixel] = image.data[pixel + 1] = image.data[pixel + 2] = value;
      const distance = Math.hypot(x + 0.5 - width * V.centerX, height * V.centerY - y - 0.5);
      image.data[pixel + 3] = Math.round(255 * Math.min(1, Math.max(0, radius - distance + 0.5)));
    }
    block = await yieldIfNeeded(block, signal, stats);
  }
  cancelled(signal);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas2D unavailable');
  canvas.width = width; canvas.height = height;
  context.putImageData(image, 0, 0);
  canvas.dataset.phaseTimestamp = String(phase.timestampMs);
  canvas.dataset.quality = textures ? 'textured' : 'geometry-only';
  return { ...stats, cpuMs: performance.now() - cpuStart, totalMs: performance.now() - start, width, height, bufferBytes: data.normal.byteLength + data.albedo.byteLength + image.data.byteLength, textured: !!textures };
}

export function releaseLunarFallbackCache() { geometryCache = undefined; mapsPromise = undefined; }
