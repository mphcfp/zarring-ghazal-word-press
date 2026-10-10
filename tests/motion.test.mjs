import assert from 'node:assert/strict';
import {MotionState,commandAllowed} from '../cockpit-src/motion.js';
let now=10000;const motion=new MotionState({now:()=>now});
assert(motion.snapshot.parked);assert(commandAllowed(motion.snapshot,{door:4}));
motion.demo(true);assert.equal(commandAllowed(motion.snapshot,{door:0}),false);assert.equal(commandAllowed(motion.snapshot,{action:'closeDoors'}),false);assert(commandAllowed(motion.snapshot,{action:'hazard'}));assert(commandAllowed(motion.snapshot,{action:'defrost'}));assert(commandAllowed(motion.snapshot,{temp:'left,1'}));
for(const gear of ['D','R','N']){motion.update({speed:0,gear,parkingBrake:true});assert.equal(motion.snapshot.parked,false);assert.equal(commandAllowed(motion.snapshot,{door:4}),false)}
motion.update({speed:0,gear:'P',parkingBrake:false});assert.equal(motion.snapshot.parked,false);
motion.update({speed:.001,gear:'P',parkingBrake:true});assert.equal(motion.snapshot.parked,false);
motion.update({speed:0,gear:'P',parkingBrake:true});assert(motion.snapshot.parked);now+=2001;assert(motion.snapshot.unknown);assert.equal(commandAllowed(motion.snapshot,{door:4}),false);
for(const payload of [{speed:-1,gear:'P',parkingBrake:true},{speed:'0',gear:'P',parkingBrake:true},{speed:NaN,gear:'P',parkingBrake:true},{speed:0,gear:'X',parkingBrake:true},{speed:0,gear:'P'},{}]){motion.update(payload);assert(motion.snapshot.unknown);assert.equal(commandAllowed(motion.snapshot,{door:0}),false)}
now=20000;motion.update({speed:48,gear:'D',parkingBrake:false,timestamp:now});assert.equal(motion.update({speed:0,gear:'P',parkingBrake:true,timestamp:now-1}),false);assert(motion.snapshot.moving);
motion.update({speed:0,gear:'P',parkingBrake:true,timestamp:now+2000});assert(motion.snapshot.unknown);
console.log('Motion interlocks: Park, positive speed, gear, parking brake, invalid/missing/stale/out-of-order data passed.');
