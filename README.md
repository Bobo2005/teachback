# Teachback

Teachback is a Next.js 14 app where you teach a topic out loud to an AI playing a curious student, then get a report on how clearly you explained it.

## Setup

Install dependencies with `npm install`, then create a `.env.local` file in the project root (or copy the placeholder one already there) and set `ANTHROPIC_API_KEY=your-key-here` to a real key from the [Anthropic Console](https://console.anthropic.com). Once that's in place, run `npm run dev` and open [http://localhost:3000](http://localhost:3000) to try it out.