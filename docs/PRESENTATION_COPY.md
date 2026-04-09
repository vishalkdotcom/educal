# EduCal — Presentation Copy (Frozen)

> **Source of truth for all slide, outro, and script copy.**
> For the session-by-session build order, critical files, and tech runbook, see [PRESENTATION_PLAN.md](./PRESENTATION_PLAN.md). Edit copy here. Edit process/plan there.

## Status

| Item | Status |
|---|---|
| Talk title frozen | Yes |
| Pipeline card stamp frozen | Yes |
| Cold open + pivot frozen | Yes |
| 5-required-items frozen | Yes |
| Live-demo y/n | Defer to Session 7 rehearsal |
| Mic handoffs (live vs Vishal-reads) | Defer to Session 7 rehearsal |

## Words to avoid

These overclaim the workflow or alienate a non-technical audience. Strike them from the slide, the outro, and anything Vishal says out loud.

- **"orchestrator"** — we drove the chain manually, prompt by prompt. Say "chat" or "workflow."
- **"cockpit"** — aviation metaphor that misfits a family-finance product.
- **"chat surface"** — developer jargon. Say **"chat window"** or just **"chat."**

*MCP is allowed on the pipeline-card stamp only, because Vishal narrates over it. Keep MCP out of the talk title so the slide survives forwarding.*

---

## Talk title

> **"One week. Five firsts. One chat window."**

Used on: the PPTX slide headline, Vishal's spoken open, any version of the slide that may be forwarded without narration.

## Pipeline-card stamp (hero visual inside the slide)

> **"Five stretches. One chat. MCP as the wiring."**

Used on: the TOOLS pipeline card only. Vishal narrates over it, so the technical term is safe here. The small variation from the title ("one chat" vs "one chat window") is intentional — it reads as layering, not drift.

---

## Cold open (0:00–0:15) — short, before the video

> *"Every parent we know is stressed about school costs and has no real plan. We built one."*

Hand off immediately to the promo. Do not overexplain before it plays — let the video do the reveal.

## Pivot line (1:35–2:00) — long, after the video

> *"One week, one chat window, five AI tools three of us had never touched before. Let me walk you through the part that mattered most: how they all fit together."*

Advance to the PPTX slide on the word "together."

---

## The 5 required items (frozen — matches the brief's rubric)

### 1. PROBLEM

- Headline: *"Parents can't plan for school costs."*
- Subhead: *"No localized data. No monthly number. No plan."*

### 2. TOOLS (the hero card)

- Header: **"Five stretches. One chat. MCP as the wiring."**
- Nodes, left → right, each with a first-time attribution:
  - **Stitch** — *new (Imam): first time drafting UI/UX with Stitch*
  - **Claude Code** — *stretch (Vishal): first time using Claude Code as the one chat reaching every other tool via MCP*
  - **Gemini API (Maps + Search grounding)** — *new (Vishal): first time using Gemini grounding features (prior use was plain prompts)*
  - **Maestro** — *new (Kavya): AI-authored YAML flows via Claude Desktop + Maestro MCP*
  - **Remotion** — *new (Vishal): first time using Remotion at all*
- Bottom stamp: *"Five tools, one chat. Manual chain today — autonomous tomorrow."*
- **Used but intentionally not on the pipeline (not stretches):** FigmaAI, plain Claude Desktop chat.

### 3. OUTPUT

- **App:** 3-step onboarding → Gemini school search → savings dashboard → per-child tracking. Offline persistence. *(Thumbnail: `mockups/step3-education-goal.png`)*
- **Promo:** 50-second rendered video from real app footage. *(Thumbnail: still frame from `video/out/educal-promo.mp4`)*
- **Tests:** Maestro E2E flows authored with AI. *(Thumbnail: small terminal-style card)*
- Tagline: *"Three deliverables. Two days of code. Real output."*

### 4. LEARNINGS (one quote per teammate)

- **Vishal** — *"I've used Claude Code and Gemini before. The stretch was wiring Stitch, Maestro, and Remotion into the same chat via MCP — first composition, first grounding, first Remotion."*
- **Kavya** — *"Natural-language to Maestro YAML collapsed test authoring time. The AI caught edge cases I would have missed."*
- **Imam** — *"Stitch was a new drafting partner for me. AI is a phenomenal draft and inspect partner — but not a production finisher. Front-load the requirement doc; it saves tokens and rework."*

### 5. NEXT TIME

- *Vishal:* Close the loop — run the chain as an autonomous loop (Ralph-style) so it self-corrects without our hand on the wheel.
- *Kavya:* Put AI into CI/CD — continuous test generation, flaky detection, self-healing flows.
- *Imam:* Pre-build design-system inspection prompts and asset-rename templates so the draft-to-production gap shrinks.

---

## 10-minute script skeleton

| Time | Who | Beat |
|---|---|---|
| 0:00–0:15 | Vishal | Cold open (short, verbatim above). Do not overexplain. |
| 0:15–1:35 | — | **Play promo video with outro** (~80s). Do not talk over it. |
| 1:35–2:00 | Vishal | Pivot line (long, verbatim above). Advance to the PPTX slide on "together." |
| 2:00–3:30 | Vishal | Walk the pipeline left→right: Stitch → Claude Code (one chat via MCP) → Gemini **grounding** → Maestro (MCP) → Remotion. Name the first-time stretch at each node. **Do not say "orchestrator," "cockpit," or "chat surface."** |
| 3:30–4:30 | Imam *(or Vishal reads)* | 60s on design. First time using Stitch. Honest line: *"AI is a phenomenal draft partner — not a production finisher."* |
| 4:30–5:30 | Kavya *(or Vishal reads)* | 60s on testing. Natural-language → Maestro YAML via Claude Desktop + MCP. One concrete example. |
| 5:30–7:00 | Vishal | Artifact tour: live Gemini school search (grounding in action), per-child savings, dashboard chart. If a fallback moment surfaces naturally, show it — it's a Q&A shortcut. |
| 7:00–8:00 | Vishal | Learnings. Pull the three quotes verbatim from section 4 above. Close with: *"I didn't expect to end the week running five AI tools from one chat window — and I didn't expect it to actually ship an app."* |
| 8:00–8:45 | Vishal | Next Time: autonomous loop, AI in CI/CD, pre-built design-system prompts. |
| 8:45–9:00 | Vishal | Pitch close (verbatim): *"Five tools, one chat, one week — a real app for real parents."* |
| 9:00–10:00 | All | Q&A buffer. Offer live demo only if time and audience permit. |

### Trimming rules if rehearsal runs past 9:30

1. Shorten the Imam and Kavya slots from 60s → 45s each (first cut).
2. Tighten the artifact tour from 90s → 60s (second cut).
3. Last resort: drop the "I didn't expect..." surprise line and go straight to the next-time section.

### Presenter assignment for 3:30–5:30

Marked *"(or Vishal reads)"* deliberately. The row assumes Imam and Kavya come in live on the mic. If the Session 7 rehearsal shows mic handoffs over Teams are risky, Vishal reads both quotes and Imam/Kavya come in live for Q&A only. Decision logged in the bottom of this file.

---

## Q&A crib

### 1. "How long did this really take?"

*About two days of Vishal's code. Four to five days end-to-end including planning, mockups, collaboration, and testing. The brief said one week — we used most of it.*

### 2. "What did MCP actually do?"

*It gave us one chat to reach every tool. Claude Code talked to Stitch, Maestro, and Remotion through MCP. Claude Desktop talked to Maestro during test authoring. We drove it manually, prompt by prompt — no autonomous loop. That's the "next time."*

### 3. "Can we use this at Labor Solutions?"

*The architecture is generic. Swap Gemini for any LLM, swap Expo for any stack, the one-chat pattern holds. The win isn't the app — it's that five new tools composed into one workflow in a week.*

### 4. "Which part was hardest?"

*Getting Gemini grounding to return localized pricing without hallucinating. We ended up constraining the prompt tightly and adding a fallback path for when the model returns nothing.*

### 5. "What if Gemini fails at demo time?"

*The app handles it. If GPS is denied, the user enters a city instead. If Gemini returns nothing, the user enters a custom cost and the app falls back to static tier hints as reference. We didn't trust a brand-new API blindly — the fallbacks are baked in.*

### 6. "What about unsupported countries?"

*Three countries supported today — US, India, Indonesia. Anything else defaults to the US model with an inline country picker as an override. It's a known gap, not a crash.*

### 7. "Could you have automated the chain?"

*Yes — and that's the "next time." A Ralph-style autonomous loop would close the cycle and let the chain self-correct. We had the building blocks. We chose to prove the composition worked first, manually, rather than chase full autonomy in a week.*

---

## Live-demo decision

**Status:** Defer to Session 7 rehearsal.

Go / no-go checklist (all four must be green):

1. Screen mirror to Teams verified with a remote joiner?
2. Gemini returning results in under 5 seconds over the Teams connection?
3. App seeded with a clean demo account (a child, a location, a school)?
4. Rehearsed tap path under 90 seconds?

Decision gets logged here once Session 7 runs.

---

## Mic handoffs decision

**Status:** Defer to Session 7 rehearsal.

**Option A — live handoffs (current default):** Imam and Kavya come in live for their 60s slots. Keeps personal voice. Risks ~10s of dead air per handoff over Teams if anyone unmutes late or their audio crackles.

**Option B — Vishal reads both:** Vishal speaks the Imam and Kavya quotes verbatim from section 4 above. Imam and Kavya come in live only for Q&A. Loses personal voice, gains reliability.

Decision gets logged here once Session 7 runs.
