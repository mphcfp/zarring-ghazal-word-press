/** UI command interlock; actual vehicle control requires an authenticated hardware adapter. */
export class MotionState {
 constructor({now=()=>Date.now(),ttl=2000}={}){this.now=now;this.ttl=ttl;this.data={source:'demo',speed:0,gear:'P',parkingBrake:true,valid:true,timestamp:now()};}
 get snapshot(){const d=this.data;const fresh=d.valid&&(d.source==='demo'||this.now()-d.timestamp<=this.ttl&&d.timestamp<=this.now()+1000);return {...d,fresh,moving:fresh&&d.speed>0,parked:fresh&&d.speed===0&&d.gear==='P'&&d.parkingBrake,unknown:!fresh};}
 update(payload){const p=payload||{};const timestamp=p.timestamp===undefined?this.now():p.timestamp;const valid=Number.isFinite(p.speed)&&p.speed>=0&&p.speed<=300&&['P','R','N','D'].includes(p.gear)&&typeof p.parkingBrake==='boolean'&&Number.isFinite(timestamp)&&timestamp>=0&&timestamp<=this.now()+1000;
  if(!valid){this.data={...this.data,source:'vehicle',valid:false,timestamp:this.now()};return false;}
  if(this.data.source==='vehicle'&&timestamp<this.data.timestamp)return false;
  this.data={source:'vehicle',speed:p.speed,gear:p.gear,parkingBrake:p.parkingBrake,valid:true,timestamp};return true;
 }
 demo(moving=false){this.data={source:'demo',speed:moving?48:0,gear:moving?'D':'P',parkingBrake:!moving,valid:true,timestamp:this.now()};}
}
export const PARK_ONLY_ACTIONS=new Set(['lock','allDoors','closeDoors','settings','orbit','capture','cameraReset','sleep','resetAll','tripReset']);
export const PARK_ONLY_TABS=new Set(['access','seat','light','trip']);
export function commandAllowed(snapshot,{action,tab,door,view,mode,paint,ambient,range,color,select}={}){
 if(snapshot.parked)return true;
 if(door!==undefined||view!==undefined||mode!==undefined||paint!==undefined||ambient!==undefined||range!==undefined||color!==undefined||select!==undefined)return false;
 if(PARK_ONLY_ACTIONS.has(action)||PARK_ONLY_TABS.has(tab))return false;
 return true;
}
