import test from 'node:test';
import assert from 'node:assert/strict';
import { createLunarClock, faintStarOpacity } from '../src/components/ui/lunarState.js';

const flush = () => new Promise(resolve => setImmediate(resolve));
function harness(calculate = async timestampMs => ({ timestampMs })) {
 let time = 1000, id = 0;
 const timers = new Map(), calls=[];
 const clock = createLunarClock({calculate: t=>{calls.push(t);return calculate(t)},now:()=>time,setTimer:(fn,delay)=>{assert.equal(delay,60000);timers.set(++id,fn);return id},clearTimer:key=>timers.delete(key)});
 return {clock,timers,calls,setTime:t=>{time=t},fire:()=>{const [key,fn]=[...timers][0];timers.delete(key);fn()}};
}
test('one snapshot/timestamp is shared by subscribers and one timer', async()=>{
 const h=harness();const seen=[];const a=h.clock.subscribe(()=>seen.push(h.clock.getSnapshot()));const b=h.clock.subscribe(()=>seen.push(h.clock.getSnapshot()));
 h.clock.setActive(true);await flush();assert.equal(seen[0],seen[1]);assert.deepEqual(h.calls,[1000]);assert.equal(h.timers.size,1);
 h.setTime(61000);h.fire();await flush();assert.equal(h.clock.getSnapshot().phase.timestampMs,61000);assert.equal(h.timers.size,1);a();b();h.clock.setActive(false);assert.equal(h.timers.size,0);
});
test('hidden/offscreen pause and resume use current time, no catch-up queue',async()=>{
 const h=harness();h.clock.setActive(true);await flush();h.clock.setActive(false);assert.equal(h.timers.size,0);h.setTime(900000);h.clock.setActive(true);await flush();assert.deepEqual(h.calls,[1000,900000]);assert.equal(h.timers.size,1);h.clock.setActive(false);
});
test('late computation cannot publish after stop',async()=>{
 let finish;const h=harness(()=>new Promise(resolve=>{finish=resolve}));h.clock.setActive(true);h.clock.setActive(false);finish({timestampMs:1000});await flush();assert.equal(h.clock.getSnapshot().phase,null);assert.equal(h.timers.size,0);
});
test('failed calculation keeps previous phase and has one bounded retry',async()=>{
 let fail=false;const h=harness(async timestampMs=>{if(fail)throw Error('test');return{timestampMs}});h.clock.setActive(true);await flush();fail=true;h.fire();await flush();assert.equal(h.clock.getSnapshot().phase.timestampMs,1000);assert.equal(h.clock.getSnapshot().error,'ephemeris-error');assert.equal(h.timers.size,1);h.clock.setActive(false);
});
test('faint-star visibility continuous, monotonic and never removes principal layer',()=>{
 assert.equal(faintStarOpacity(0),1);assert.ok(Math.abs(faintStarOpacity(1)-0.28)<1e-12);assert.equal(faintStarOpacity(-1),1);assert.ok(Math.abs(faintStarOpacity(2)-0.28)<1e-12);
 let previous=1;for(let i=0;i<=1000;i++){const value=faintStarOpacity(i/1000);assert.ok(value<=previous+1e-12);assert.ok(value>=0.28-1e-12);previous=value}
 assert.ok(Math.abs(faintStarOpacity(0.5-1e-6)-faintStarOpacity(0.5+1e-6))<0.00001);
});
