import type { LevelDefinition } from './LevelDefinition';

/** Hand-designed campaign. Each world introduces a new player skill. */
export const LEVELS: readonly LevelDefinition[] = [
  { id:'w01-l01',world:1,number:1,type:'find-odd',difficulty:1,timeLimitMs:9000,title:'Warm Up',instruction:'Find the odd one.',accent:0x7c5cff },
  { id:'w01-l02',world:1,number:2,type:'safe-target',difficulty:2,timeLimitMs:7000,title:'Trust Your Eyes',instruction:'Tap the only safe shape.',accent:0x00d4a8 },
  { id:'w01-l03',world:1,number:3,type:'dont-touch',difficulty:2,timeLimitMs:6000,title:'Do Nothing',instruction:"Whatever you do... don't tap.",accent:0xffb020 },
  { id:'w01-l04',world:1,number:4,type:'memory',difficulty:3,timeLimitMs:8000,title:'Remember Me',instruction:'Watch the sequence. Repeat it.',accent:0xff5c8a },
  { id:'w01-l05',world:1,number:5,type:'fake-button',difficulty:3,timeLimitMs:6000,title:'Too Obvious',instruction:'Press the button that is NOT obvious.',accent:0xff6b6bff },
  { id:'w01-l06',world:1,number:6,type:'moving-target',difficulty:4,timeLimitMs:5000,title:'Catch Me',instruction:'Catch the target before it escapes.',accent:0x00b8d9 },
  { id:'w01-l07',world:1,number:7,type:'reverse',difficulty:4,timeLimitMs:6000,title:'Think Backwards',instruction:'Do the opposite of what you expect.',accent:0xff5277 },
  { id:'w01-l08',world:1,number:8,type:'pattern',difficulty:5,timeLimitMs:7000,title:'Spot The Rule',instruction:'Find what the pattern is hiding.',accent:0x8ed081 },
  { id:'w01-l09',world:1,number:9,type:'boss',difficulty:6,timeLimitMs:12000,title:'The Trickster',instruction:'The rules are about to change.',accent:0xff4d8d },
  { id:'w01-l10',world:1,number:10,type:'boss',difficulty:7,timeLimitMs:15000,title:"DON'T TRUST ANYTHING",instruction:"Beat the world's first real trick.",accent:0xffd166 },
  { id:'w02-l01',world:2,number:1,type:'reaction',difficulty:4,timeLimitMs:5000,title:'Blink And Miss',instruction:'Tap the target the instant it appears.',accent:0x00d4a8 },
  { id:'w02-l02',world:2,number:2,type:'fake-button',difficulty:5,timeLimitMs:5000,title:'Trust Nobody',instruction:'One button tells the truth.',accent:0xff5577 },
  { id:'w02-l03',world:2,number:3,type:'moving-target',difficulty:5,timeLimitMs:4500,title:'Too Fast',instruction:'Catch the target. No hesitation.',accent:0x00b8d9 },
  { id:'w02-l04',world:2,number:4,type:'memory',difficulty:5,timeLimitMs:7000,title:'Short Memory',instruction:'Remember four moves.',accent:0xffb020 },
  { id:'w02-l05',world:2,number:5,type:'reverse',difficulty:6,timeLimitMs:5000,title:'Opposite Day',instruction:'Your first instinct is wrong.',accent:0x8b72ff },
  { id:'w02-l06',world:2,number:6,type:'find-odd',difficulty:6,timeLimitMs:5000,title:'Tiny Difference',instruction:'Find it before the clock wins.',accent:0x36e0a0 },
  { id:'w02-l07',world:2,number:7,type:'pattern',difficulty:6,timeLimitMs:6000,title:'Break The Pattern',instruction:'Something is deliberately wrong.',accent:0xff6b6b },
  { id:'w02-l08',world:2,number:8,type:'dont-touch',difficulty:6,timeLimitMs:5000,title:'Hands Off',instruction:'Win by doing absolutely nothing.',accent:0xffd166 },
  { id:'w02-l09',world:2,number:9,type:'boss',difficulty:7,timeLimitMs:11000,title:'MIND GAMES',instruction:'Three tricks. One life.',accent:0xff4d8d },
  { id:'w02-l10',world:2,number:10,type:'boss',difficulty:8,timeLimitMs:14000,title:'THE LIAR',instruction:"Nothing on screen is quite what it says.",accent:0xffd166 },
  { id:'w03-l01',world:3,number:1,type:'reaction',difficulty:6,timeLimitMs:4000,title:'Reflex',instruction:'React faster than your brain thinks.',accent:0x00d4a8 },
  { id:'w03-l02',world:3,number:2,type:'memory',difficulty:6,timeLimitMs:6500,title:'Four Steps',instruction:'Watch. Remember. Execute.',accent:0x7c5cff },
  { id:'w03-l03',world:3,number:3,type:'reverse',difficulty:7,timeLimitMs:4500,title:'Second Guess',instruction:'Ignore your first answer.',accent:0xff5577 },
  { id:'w03-l04',world:3,number:4,type:'moving-target',difficulty:7,timeLimitMs:4000,title:'Ghost Target',instruction:'It moves when you move.',accent:0x00b8d9 },
  { id:'w03-l05',world:3,number:5,type:'pattern',difficulty:7,timeLimitMs:5000,title:'Hidden Rule',instruction:'Spot the rule before it changes.',accent:0xffb020 },
  { id:'w03-l06',world:3,number:6,type:'find-odd',difficulty:7,timeLimitMs:4000,title:'Needle In A Haystack',instruction:'One tiny detail is different.',accent:0x36e0a0 },
  { id:'w03-l07',world:3,number:7,type:'fake-button',difficulty:7,timeLimitMs:4500,title:'The Obvious Trap',instruction:'Do not trust the biggest button.',accent:0x8b72ff },
  { id:'w03-l08',world:3,number:8,type:'dont-touch',difficulty:7,timeLimitMs:4500,title:'Patience',instruction:'Win by doing absolutely nothing.',accent:0xffd166 },
  { id:'w03-l09',world:3,number:9,type:'boss',difficulty:8,timeLimitMs:10000,title:'CHAOS MODE',instruction:'Every rule you learned can betray you.',accent:0xff4d8d },
  { id:'w03-l10',world:3,number:10,type:'boss',difficulty:9,timeLimitMs:13000,title:'TRICKY MASTER',instruction:"If you think you know the answer, you probably don't.",accent:0xffd166 },
];

export const WORLD_COUNT = 3;
export const LEVELS_PER_WORLD = 10;
export function getWorldLevels(world: number): readonly LevelDefinition[] {
  return LEVELS.filter((level) => level.world === world);
}
