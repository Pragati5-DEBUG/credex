# Reflection — Credex Round 1

_Answer each question in **150–400 words**. Replace the placeholders below with your real experience._

---

## 1. The hardest bug you hit this week, and how you debugged it

On production, “Create read-only link” used the real https host, but “Save lead & email link” often showed http://localhost:3000/r/...; Resend 403 made it feel like one failure.

I checked Vercel env and Network: leads saved, so the bug was shareUrl from appOrigin() and NEXT_PUBLIC_APP_URL still set to localhost, not Supabase. The share button used window.location.origin, so the two flows disagreed.

I set the live URL on Vercel, redeployed, and fixed origin from request Host / x-forwarded-host. Resend 403 was separate (sandbox recipient limits). A JSX open/close mismatch had also broken CI until lint/build caught it.

---

## 2. A decision you reversed mid-week, and what made you reverse it

After researching Grafient, I first leaned towards asking users for their provider API keys so the app could pull live usage like that category does. I reversed that for this MVP.

The Credex brief wants a fast audit from declared plans, seats, and monthly spend, with math tied to cited list prices—not OAuth or key paste before value. I kept intake to self-reported numbers and localStorage, and ran runAudit as rules in TypeScript.

---

## 3. What you would build in week 2 if you had it

With a second week it would be a different ballgame: week one was ship the MVP and prove the audit path; week two would be brand and differentiation.

I would re-skin the product in Credex-style green and white so it reads as their lead-gen surface, not another dark spend dashboard like Grafient or Verbal. I would tighten copy, typography, and the summary page so the methodology and PRICING_DATA citations are visible without feeling like a template clone.

A customer reviewer's section would be great.

---

## 4. How you used AI tools

I used Cursor on the Pro plan for most of the build: repo setup, Next.js routes, Supabase and API routes, audit engine wiring, deploy and env debugging, and submission markdown drafts.

I did not trust it for creative elements—landing tone, hero rhythm, how the summary should feel next to Grafient/Verbal, or Credex-style positioning. I sketched those myself or pulled from research and edited every line.

One concrete miss: while editing the audit summary share block, generated JSX mixed a motion.div open with a plain div close. CI and eslint failed until I ran lint locally and fixed the tags.

I also double-checked savings logic and PRICING_DATA against vendor pages instead of accepting model numbers.

---

## 5. Self-rating (1–10) with one sentence each

| Dimension | Score | Reason |
|-----------|-------|--------|
| Discipline | 8 | Steady work once exams ended and honest devlog, but I started the build on 2026-05-10 and missed the five-day commit spread until later. |
| Code quality | 7 | Clear split between rules, APIs, and UI, though deploy and JSX slips showed I should lint before every push. |
| Design sense | 9 | Landing and summary follow patterns from Grafient and Verbal without copying them blindly. |
| Problem-solving | 9 | Production URL, env, and CI issues were narrowed with logs and local repro instead of guessing. |
| Entrepreneurial thinking | 9 | I judged the product by whether I would use it myself—design and trust first, value before email, and shareable numbers I would actually forward. |
