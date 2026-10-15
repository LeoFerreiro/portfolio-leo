import { Body, Ecliptic, GeoMoon, HelioVector, MakeTime, Observer, ObserverVector, Vector } from "astronomy-engine";

/**
 * Uses astronomy-engine 2.1.19 (Don Cross, MIT).
 * Full upstream notice: /licenses/astronomy-engine-MIT.txt.
 * Source: https://github.com/cosinekitty/astronomy/tree/v2.1.19
 * Conventional approximate city reference, not a personal location; height is a model choice.
 */
export const BUENOS_AIRES_REFERENCE = Object.freeze({ latitude: -34.6037, longitude: -58.3816, heightMeters: 0 });

const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const subtract = (a, b) => a.map((value, i) => value - b[i]);
const array = (v) => [v.x, v.y, v.z];
const clamp = (value) => Math.max(-1, Math.min(1, value));
const unit = (v) => {
  if (!Array.isArray(v) || v.length !== 3 || !v.every(Number.isFinite)) throw new TypeError("Expected a finite 3D vector");
  const length = Math.hypot(...v);
  if (length < 1e-14) throw new RangeError("Degenerate geometry");
  return v.map((value) => value / length);
};

/**
 * Same-time geometric EQJ (J2000 equatorial) vectors, all in the same units.
 * +Z points Moon→observer; +Y is projected celestial J2000 north (not local zenith).
 * +X completes a right-handed basis. solarDirection points FROM Moon TOWARD Sun.
 * No screen-angle normalization: the light vector stays continuous through new moon.
 */
export function illuminationFromVectors(moon, sun, observer) {
  // Validate positions before arithmetic, including array dimensions.
  for (const v of [moon, sun, observer]) {
    if (!Array.isArray(v) || v.length !== 3 || !v.every(Number.isFinite)) throw new TypeError("Expected a finite 3D position");
  }
  const light = unit(subtract(sun, moon));
  const z = unit(subtract(observer, moon));
  const north = [0, 0, 1];
  const y = unit(north.map((value, i) => value - dot(north, z) * z[i]));
  const x = [y[1] * z[2] - y[2] * z[1], y[2] * z[0] - y[0] * z[2], y[0] * z[1] - y[1] * z[0]];
  const cosine = clamp(dot(light, z));
  return {
    illuminatedFraction: (1 + cosine) / 2,
    phaseAngleRadians: Math.acos(cosine),
    solarDirection: [dot(light, x), dot(light, y), cosine],
    basisEQJ: { x, y, z },
  };
}

/**
 * Pure, deterministic geometry. Accepts numeric Unix milliseconds only; no clock/API/DOM.
 * Supported application interval: 1900-01-01 through 2100-12-31 UTC (not an accuracy claim).
 * All positions are simultaneous geometric EQJ/AU, without aberration/light-time.
 * This deliberately avoids mixing apparent positions with geometric observer vectors.
 * The visual terrain orientation and renderer integration are outside this module.
 */
export function getLunarEphemeris(timestampMs, reference = BUENOS_AIRES_REFERENCE) {
  if (!Number.isFinite(timestampMs)) throw new TypeError("Expected finite Unix milliseconds");
  if (timestampMs < Date.UTC(1900, 0, 1) || timestampMs >= Date.UTC(2101, 0, 1)) throw new RangeError("Timestamp outside supported interval 1900–2100 UTC");
  const { latitude, longitude, heightMeters } = reference;
  if (![latitude, longitude, heightMeters].every(Number.isFinite)) throw new TypeError("Invalid observer reference");
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || heightMeters < -500 || heightMeters > 10000) throw new RangeError("Observer outside supported bounds");
  const time = MakeTime(new Date(timestampMs));
  const earth = HelioVector(Body.Earth, time);
  const moon = GeoMoon(time);
  const sun = new Vector(-earth.x, -earth.y, -earth.z, time);
  const observer = ObserverVector(time, new Observer(latitude, longitude, heightMeters), false);
  const geometry = illuminationFromVectors(array(moon), array(sun), array(observer));
  const longitudeDifference = Ecliptic(moon).elon - Ecliptic(sun).elon;
  const phaseLongitudeDegrees = ((longitudeDifference % 360) + 360) % 360;
  return {
    timestampMs,
    reference: { latitude, longitude, heightMeters },
    ...geometry,
    // Geocentric longitude convention, NOT fraction, angular separation or age.
    phaseLongitudeDegrees,
    cycleFraction: phaseLongitudeDegrees / 360,
    waxing: phaseLongitudeDegrees < 180,
    elongationRadians: Math.acos(clamp(dot(unit(array(moon)), unit(array(sun))))),
  };
}
