export type ChallengeKind = 'observation' | 'memory' | 'reaction' | 'pattern' | 'logic' | 'deception' | 'timing' | 'reverse' | 'combination';

export interface ChallengeSpec {
  id: string;
  world: number;
  level: number;
  kind: ChallengeKind;
  difficulty: 1|2|3|4|5|6|7|8|9|10;
  title: string;
  instruction: string;
  twist?: string;
  mechanics: ChallengeKind[];
  timeLimitMs: number;
}

export const CHALLENGE_CATALOG: readonly ChallengeSpec[] = [
  {id:'w01-l01',world:1,level:1,kind:'observation',difficulty:1,title:'Warm Up',instruction:'Find the tiny difference.',mechanics:['observation'],timeLimitMs:9000},
  {id:'w01-l02',world:1,level:2,kind:'observation',difficulty:2,title:'Color Trap',instruction:'Find the target. It is not the brightest one.',mechanics:['observation','logic'],timeLimitMs:8000},
  {id:'w01-l03',world:1,level:3,kind:'timing',difficulty:2,title:'Do Nothing',instruction:"Don't tap anything. Let the trick finish.",mechanics:['timing'],timeLimitMs:6500},
  {id:'w01-l04',world:1,level:4,kind:'memory',difficulty:2,title:'Memory Flash',instruction:'Watch the symbol. Then find it.',mechanics:['memory','observation'],timeLimitMs:7500},
  {id:'w01-l05',world:1,level:5,kind:'deception',difficulty:3,title:'Too Obvious',instruction:'The biggest button is probably lying.',twist:'visual emphasis is misleading',mechanics:['deception','logic'],timeLimitMs:6500},
  {id:'w01-l06',world:1,level:6,kind:'reaction',difficulty:3,title:'Catch Me',instruction:'Tap the target before it moves again.',mechanics:['reaction','timing'],timeLimitMs:5500},
  {id:'w01-l07',world:1,level:7,kind:'reverse',difficulty:4,title:'Think Backwards',instruction:'Do the opposite of your first instinct.',mechanics:['reverse','logic'],timeLimitMs:6000},
  {id:'w01-l08',world:1,level:8,kind:'pattern',difficulty:4,title:'Break The Pattern',instruction:'Find what does not belong in the rule.',mechanics:['pattern','observation'],timeLimitMs:7000},
  {id:'w01-l09',world:1,level:9,kind:'combination',difficulty:5,title:'Mini Boss',instruction:'Remember it, then react to it.',mechanics:['memory','reaction'],timeLimitMs:9000},
  {id:'w01-l10',world:1,level:10,kind:'combination',difficulty:6,title:'The First Trickster',instruction:'The rule changes once. Adapt.',twist:'instruction changes mid-level',mechanics:['observation','reaction','deception'],timeLimitMs:11000},
  {id:'w02-l01',world:2,level:1,kind:'deception',difficulty:4,title:'Fake Difference',instruction:'Two objects look different. Check carefully.',mechanics:['deception','observation'],timeLimitMs:6500},
  {id:'w02-l02',world:2,level:2,kind:'deception',difficulty:4,title:'Moving Background',instruction:'Ignore the movement. Find what stays still.',mechanics:['deception','observation'],timeLimitMs:6500},
  {id:'w02-l03',world:2,level:3,kind:'deception',difficulty:5,title:'Fake Button',instruction:'The loudest button is a trap.',mechanics:['deception','logic'],timeLimitMs:6000},
  {id:'w02-l04',world:2,level:4,kind:'timing',difficulty:5,title:'Disappearing Target',instruction:'Remember where it was before it vanished.',mechanics:['timing','memory'],timeLimitMs:6500},
  {id:'w02-l05',world:2,level:5,kind:'deception',difficulty:5,title:'Color Lie',instruction:'The word and the color disagree.',mechanics:['deception','logic'],timeLimitMs:5500},
  {id:'w02-l06',world:2,level:6,kind:'reverse',difficulty:6,title:'Mirror',instruction:'Everything is reversed. Your instinct is not.',mechanics:['reverse','observation'],timeLimitMs:5500},
  {id:'w02-l07',world:2,level:7,kind:'memory',difficulty:6,title:'Invisible Button',instruction:'Remember where the button disappeared.',mechanics:['memory','observation'],timeLimitMs:6500},
  {id:'w02-l08',world:2,level:8,kind:'timing',difficulty:7,title:'Fake Countdown',instruction:"Don't panic when the timer lies.",mechanics:['timing','deception'],timeLimitMs:7000},
  {id:'w02-l09',world:2,level:9,kind:'logic',difficulty:7,title:'The Liar',instruction:'Three statements. Only one is true.',mechanics:['logic','deception'],timeLimitMs:9000},
  {id:'w02-l10',world:2,level:10,kind:'combination',difficulty:8,title:'The Liar Boss',instruction:'The interface itself is trying to fool you.',mechanics:['deception','logic','reaction'],timeLimitMs:12000},
  {id:'w03-l01',world:3,level:1,kind:'memory',difficulty:4,title:'Three Steps',instruction:'Remember three symbols and repeat them.',mechanics:['memory'],timeLimitMs:7000},
  {id:'w03-l02',world:3,level:2,kind:'memory',difficulty:5,title:'Four Steps',instruction:'Four symbols. One sequence.',mechanics:['memory'],timeLimitMs:7500},
  {id:'w03-l03',world:3,level:3,kind:'memory',difficulty:5,title:'Fast Flash',instruction:'The sequence disappears sooner.',mechanics:['memory','timing'],timeLimitMs:6500},
  {id:'w03-l04',world:3,level:4,kind:'reverse',difficulty:6,title:'Backwards Memory',instruction:'Repeat the sequence backwards.',mechanics:['memory','reverse'],timeLimitMs:7500},
  {id:'w03-l05',world:3,level:5,kind:'memory',difficulty:6,title:'Position Lock',instruction:'Remember where each symbol appeared.',mechanics:['memory','observation'],timeLimitMs:8000},
  {id:'w03-l06',world:3,level:6,kind:'combination',difficulty:7,title:'Color + Position',instruction:'Remember both the color and its position.',mechanics:['memory','observation'],timeLimitMs:8500},
  {id:'w03-l07',world:3,level:7,kind:'memory',difficulty:7,title:'What Changed?',instruction:'Spot the single change after the flash.',mechanics:['memory','observation'],timeLimitMs:6500},
  {id:'w03-l08',world:3,level:8,kind:'logic',difficulty:7,title:'Two Sequences',instruction:'Which sequence changed?',mechanics:['memory','logic'],timeLimitMs:8000},
  {id:'w03-l09',world:3,level:9,kind:'combination',difficulty:8,title:'Memory Sprint',instruction:'Remember it, then beat the clock.',mechanics:['memory','reaction','timing'],timeLimitMs:7500},
  {id:'w03-l10',world:3,level:10,kind:'combination',difficulty:9,title:'Memory Master',instruction:'Reconstruct the sequence under pressure.',mechanics:['memory','reverse','timing'],timeLimitMs:11000},
];
