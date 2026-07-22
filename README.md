# Teachback

Teachback is a Next.js 14 app where you teach a topic out loud to an AI playing a curious student, then get a report on how clearly you explained it.

## How Teachback is different

The "explain it to an AI" pattern isn't new — there's a whole crowded field of Feynman-technique study apps doing some version of explain → get feedback. Most of what's out there, though, shares the same gaps:

- **They grade you on a rubric. Teachback grades you on your own words.** Every "clear point" and every "gap" in your report is grounded in an exact quote pulled from your transcript — not a generic "clarity score," but the actual sentence that proved (or didn't prove) you understood it.
- **They evaluate one big explanation. Teachback has a real conversation.** The AI student reacts turn-by-turn to what you just said — including catching it when you contradict something you said three messages earlier, which requires genuine conversational memory, not a single-shot evaluation.
- **They bury the technique in a feature list. Teachback does one thing.** No flashcards, no quizzes, no subscription tiers — just the loop that matters: explain it, get caught, see exactly what to fix.
- **They ask for a signup before you can try it. Teachback doesn't.** No account, no paywall — straight from the landing page into the conversation.

None of this makes the underlying idea original — the Feynman technique is decades old, and "teach an AI" is an established pattern. What we focused on instead was making the one loop that actually matters (explain → get genuinely questioned → see the receipts) as tight and honest as possible, rather than surrounding it with features that dilute it.


## What sets it apart

The "explain it to an AI" pattern isn't new — there's a crowded field of Feynman-technique study apps doing some version of explain → get feedback. Researching that space surfaced a consistent gap: most of them stop at *identifying* what's wrong and never make you prove you fixed it, and none of them advertise catching self-contradiction across a conversation. Two features address that directly:

- **Contradiction detection.** The report doesn't just flag vague or incomplete explanations — it has a dedicated section that catches you asserting something, then later in the same session saying something that directly conflicts with it. Both quotes are shown side by side, verbatim, so it's not a vague "be more consistent" note but the exact two sentences that don't add up.
- **Practice quiz per gap.** Every gap in the report comes with a "Test yourself" button that generates a short, CBT-style multiple-choice quiz targeting *that specific* weak point — not the topic in general. Answer all three questions and the score is saved into the report itself, so the loop doesn't end at "here's what you got wrong" — it closes with "and here's proof you fixed it."

## Setup

Install dependencies with `npm install`, then create a `.env.local` file in the project root (or copy the placeholder one already there) and set `ANTHROPIC_API_KEY=your-key-here` to a real key from the [Anthropic Console](https://console.anthropic.com). Once that's in place, run `npm run dev` and open [http://localhost:3000](http://localhost:3000) to try it out.