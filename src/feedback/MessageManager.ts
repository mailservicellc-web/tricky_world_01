import type { GameFeedbackContext } from './MessageContext';

const messages: Record<GameFeedbackContext['event'], readonly string[]> = {
  'level-complete': ['Okay... that was suspiciously good.','You actually figured it out?!','Fine. You can have this one.','Okay genius, calm down.','Tricky approves. Unfortunately.'],
  perfect: ['PERFECT?! Who gave you permission to be this good?','Zero mistakes. Suspicious behavior detected.','Okay... hacker.','I am starting to regret making this game.'],
  streak: ['Someone stop this person.','THE GAME IS GETTING NERVOUS.','Tricky has filed a complaint.','Please go outside. Eventually.'],
  'world-complete': ['You survived the tutorial. Unfortunately, it gets worse.','Your brain is officially doing overtime.','Okay... you are actually good.'],
  'boss-complete': ['That was supposed to take longer.','You beat THAT?! I need stronger tricks.','Okay. You win... for now.'],
  'new-high-score': ['NEW HIGH SCORE. Your past self is furious.','You just made your old score look embarrassing.','That score is getting suspicious.'],
  failure: ['That... was not the plan.','Your finger betrayed you.','Bold strategy. Terrible execution.','You had ONE job.','Respectfully... WHAT WAS THAT?','Tricky: 1 — You: 0.'],
};

export function getGameMessage(context: GameFeedbackContext): string {
  const pool = messages[context.event];
  if (!pool.length) return '';
  if (context.event === 'streak' && (context.streak ?? 0) >= 20) return 'PLEASE GO OUTSIDE. 😂';
  return pool[Math.floor(Math.random() * pool.length)];
}
