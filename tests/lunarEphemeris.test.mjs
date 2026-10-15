import test from 'node:test';
import assert from 'node:assert/strict';
import { getLunarEphemeris, illuminationFromVectors, BUENOS_AIRES_REFERENCE } from '../src/components/ui/lunarEphemeris.js';

const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} vs ${expected}`);
const norm = (v) => Math.hypot(...v);
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

// MODEL-BASED regression dates: generated with Astronomy Engine 2.1.19
// SearchMoonPhase on 2026-10-01 UTC. These are NOT independent USNO/JPL fixtures.
const cases = [
  ['new', '2026-10-10T15:50:36.724Z', 0, true],
  ['thin waxing', '2026-10-11T22:09:40.010Z', 15, true],
  ['first quarter', '2026-10-18T16:13:19.496Z', 90, true],
  ['waxing gibbous', '2026-10-22T15:20:36.414Z', 135, true],
  ['full', '2026-10-26T04:12:15.538Z', 180, false],
  ['waning gibbous', '2026-10-29T11:24:28.379Z', 225, false],
  ['last quarter', '2026-10-03T13:25:33.710Z', 270, false],
  ['thin waning', '2026-10-09T10:14:44.719Z', 345, false],
];
for (const [name, utc, angle, waxing] of cases) {
  test(`model regression: ${name}`, () => {
    const r = getLunarEphemeris(Date.parse(utc));
    const error = ((r.phaseLongitudeDegrees - angle + 540) % 360) - 180;
    close(error, 0, 0.05); // Apparent phase-event definition vs same-time geometry.
    assert.ok(r.illuminatedFraction >= 0 && r.illuminatedFraction <= 1);
    close(r.illuminatedFraction, (1 - Math.cos(angle * Math.PI / 180)) / 2, 0.025);
    // Exact event boundaries differ slightly between geometric/apparent definitions.
    if (angle !== 0 && angle !== 180) assert.equal(r.waxing, waxing);
    close(norm(r.solarDirection), 1);
    close(r.illuminatedFraction, (1 + r.solarDirection[2]) / 2);
  });
}

for (const [label, sun, expected] of [['full',[0,0,10],1], ['new',[0,0,-10],0], ['right',[10,0,0],0.5], ['left',[-10,0,0],0.5]]) {
  test(`independent analytic geometry: ${label}`, () => {
    // Observer looks along +X EQJ; celestial north is Z. Place test Sun in that basis.
    const mapped = [sun[2], sun[0], sun[1]];
    const r = illuminationFromVectors([0,0,0], mapped, [1,0,0]);
    close(r.illuminatedFraction, expected);
    close(norm(r.solarDirection), 1);
  });
}

test('equal fraction does not erase opposite light directions', () => {
  const a = illuminationFromVectors([0,0,0], [0,1,0], [1,0,0]);
  const b = illuminationFromVectors([0,0,0], [0,-1,0], [1,0,0]);
  close(a.illuminatedFraction,b.illuminatedFraction);
  close(a.solarDirection[0], -b.solarDirection[0]);
});

test('smooth geometry across model conjunction; scalar phase wrap is not a light jump', () => {
  const t = Date.parse('2026-10-10T15:50:36.724Z');
  const points = [-600000,-60000,0,60000,600000].map(dt => getLunarEphemeris(t+dt));
  assert.ok(points[0].phaseLongitudeDegrees > 359);
  assert.ok(points.at(-1).phaseLongitudeDegrees < 1);
  for (let i=1;i<points.length;i++) {
    assert.ok(Math.hypot(...points[i].solarDirection.map((v,k)=>v-points[i-1].solarDirection[k])) < 0.005);
    assert.ok(Math.abs(points[i].illuminatedFraction-points[i-1].illuminatedFraction)<0.001);
  }
});

test('explicit offsets describe the same instant', () => {
  const dates = ['2026-10-15T12:00:00Z','2026-10-15T09:00:00-03:00','2026-10-15T21:00:00+09:00'];
  const states = dates.map(d=>getLunarEphemeris(Date.parse(d)));
  assert.deepEqual(states[0],states[1]);assert.deepEqual(states[0],states[2]);
});

test('sampling leap day, year boundary and two years yields finite orthonormal geometry', () => {
  const dates=['2024-02-29T23:59:59Z','2025-12-31T23:59:59Z','2026-01-01T00:00:00Z'];
  for(let month=0;month<24;month++) dates.push(new Date(Date.UTC(2025,month,15,12)).toISOString());
  for(const date of dates) {
    const r=getLunarEphemeris(Date.parse(date));
    assert.ok(Number.isFinite(r.elongationRadians));assert.ok(Number.isFinite(r.phaseAngleRadians));
    assert.ok(r.cycleFraction>=0&&r.cycleFraction<1);
    for(const axis of Object.values(r.basisEQJ)) close(norm(axis),1);
    close(dot(r.basisEQJ.x,r.basisEQJ.y),0);close(dot(r.basisEQJ.y,r.basisEQJ.z),0);
    assert.deepEqual(r,getLunarEphemeris(Date.parse(date)));
  }
});

test('observer is configurable, copied and never mutates conventional reference', () => {
  const config={...BUENOS_AIRES_REFERENCE};
  const a=getLunarEphemeris(Date.parse('2026-10-15T00:00:00Z'),config);
  const b=getLunarEphemeris(a.timestampMs,{latitude:0,longitude:0,heightMeters:0});
  assert.notDeepEqual(a.solarDirection,b.solarDirection);
  a.reference.latitude=0;assert.equal(config.latitude,BUENOS_AIRES_REFERENCE.latitude);
  assert.ok(Object.isFrozen(BUENOS_AIRES_REFERENCE));
});

test('invalid inputs fail explicitly instead of returning NaN', () => {
  for(const t of [NaN,Infinity,-Infinity,'2026-10-15',null,undefined]) assert.throws(()=>getLunarEphemeris(t),TypeError);
  for(const t of [Date.UTC(1899,11,31),Date.UTC(2101,0,1)]) assert.throws(()=>getLunarEphemeris(t),RangeError);
  const t=Date.parse('2026-10-15T00:00:00Z');
  assert.throws(()=>getLunarEphemeris(t,{latitude:91,longitude:0,heightMeters:0}),RangeError);
  assert.throws(()=>getLunarEphemeris(t,{latitude:0,longitude:NaN,heightMeters:0}),TypeError);
  assert.throws(()=>illuminationFromVectors([0,0,0],[0,0,0],[1,0,0]),RangeError);
  assert.throws(()=>illuminationFromVectors([0,0],[1,0,0],[0,1,0]),TypeError);
  assert.throws(()=>illuminationFromVectors([0,0,0],[1,0,0],[0,0,1]),RangeError);
});
