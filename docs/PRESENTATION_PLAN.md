# EduCal — Presentation-Day Plan (Session-by-Session)

## Context

Labor Solutions' AI Innovation Sprint wraps Friday, April 10 2026 (tomorrow). Team **Vishal / Imam / Kavya** built **EduCal**, a mobile family savings-planner with Gemini-grounded school search. Deliverable per the brief: **one slide + ten-minute presentation to the full company** covering Problem, Tools, Output, Learnings, Next Time. Judging: problem solving, use of tools, creativity (equal weight). Demo format: **promo video first, live demo only if asked**. Presenter: **Vishal**, remote via **MS Teams**. Imam and Kavya jump in when called.

**What's actually built** (verified in repo):
- Expo app: 3-step onboarding, 4 tabs, school detail, Gemini Maps + Search grounding, Zustand persistence, Maestro E2E flows
- Rendered 50-second 1920×1080 promo with music at `video/out/educal-promo.mp4` (6 scenes)
- Mockups in `mockups/`, team experience data in `team-experience-data.md`
- **No backend** — Gemini is called directly from the app

**Corrections vs the previous plan** (`fizzy-leaping-pixel.md`), based on your notes:
- **Timeline honesty.** ~2 days of Vishal's code, ~4–5 days total including mockup generation, planning, collaboration and testing. Every public claim must match this.
- **No real chain.** MCP tools were all reachable from Claude Code / Claude Desktop, but each stage was driven by manual prompting. The word "orchestrator" overclaims — drop it.
- **Imam's stretch is Stitch** (not "publishing Claude Code outputs as editable Figma files"). Update slides, outro, script.
- **PowerPoint** is the slide tool. **MS Teams** is the presentation surface. Video plays via **mpv or VLC** during a Teams screen-share with "Include computer sound" toggled on.
- **No QR / no link** on the slide.
- **Live-demo decision** deferred to rehearsal.

---

## Lead angle (frozen)

### "Five AI tools. One chat surface. MCP as the wiring."

Honest framing of the composition story. Claude Code + Claude Desktop became a single cockpit — MCP let us reach **Stitch, Gemini grounding, Maestro, and Remotion** from one chat. We drove it manually this sprint. Next time we'd close the loop and let it self-correct.

**Why this wins on the rubric:**

| Criterion | How it lands |
|---|---|
| Problem solving | A real family finance app with a live AI backend, not a toy. |
| Use of tools | Every teammate stretched into something they hadn't done before, and the stretches **composed** into one workstation. |
| Creativity | The *composition* is the creative move — five tools reached from one chat via MCP is novel, and the honest manual-chain → autonomous-chain arc is a clean narrative. |

**One-line pitch:** *"Five tools, one chat, one week — a real app for real parents."*

---

## Frozen copy for the 5 required items

This is the single source of truth for the outro cards, the exported slide PNG, and the PowerPoint layout. Nothing diverges from here.

### 1. PROBLEM
- Headline: *"Parents can't plan for school costs."*
- Subhead: *"No localized data. No monthly number. No plan."*

### 2. TOOLS (the hero card)
- Header: *"Five AI tools. One chat surface. MCP as the wiring."*
- Nodes, in pipeline order, with attribution-aware "new" labels:
  - **Stitch** — *new (Imam): drafting UI/UX with Stitch for the first time*
  - **Claude Code** — *stretch (Vishal): first time using Claude Code as the cockpit reaching every other tool via MCP*
  - **Gemini API (Maps + Search grounding)** — *new (Vishal): first time using Gemini grounding features (prior use was plain prompts)*
  - **Maestro** — *new (Kavya): AI-authored YAML flows driven from natural language via Claude Desktop + Maestro MCP*
  - **Remotion** — *new (Vishal): first time using Remotion at all*
- Bottom stamp: *"Five tools, one chat. Manual chain today — autonomous tomorrow."*
- **Tools intentionally NOT on the pipeline:** FigmaAI, plain Claude Desktop chat. Used, but not stretches.

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

## Session plan

Each session is scoped to **one focused deliverable** so you can stop and resume cleanly. Mark sessions `[critical]` or `[polish]`. If time runs out, everything marked `[polish]` is skippable.

### Session 1 — Freeze the presentation copy `[critical]`

**Goal:** Single source of truth for all slide/outro/script copy. Pure writing, no code.

**Steps:**
1. Create `docs/PRESENTATION_COPY.md` and paste the "Frozen copy for the 5 required items" block above, verbatim. This becomes the authoritative file the outro, slide PNG and script pull from.
2. Append the **script skeleton** (from Session 7 below) to the same file so rehearsal has one file to read.
3. Verify each teammate quote matches `team-experience-data.md` in spirit — the quotes above are already compressed for delivery, but shouldn't contradict the source.

**Verification:** `docs/PRESENTATION_COPY.md` exists, contains the 5 cards verbatim, and is the only place copy is edited going forward.

---

### Session 2 — Build Remotion outro scene components `[critical]`

**Goal:** New TSX components for the outro cards, each driven by the frozen copy file.

**New files in `video/src/scenes/`:**
- `OutroTitle.tsx` — 1.5s "How we built it" title card
- `OutroProblem.tsx` — 3s headline + subhead
- `OutroTools.tsx` — 9s animated pipeline (the money shot). Nodes draw left→right, connecting lines animate in, "(new)" stamps pop next to each node, bottom stamp lands last.
- `OutroOutput.tsx` — 4s three thumbnails + tagline
- `OutroLearnings.tsx` — 7s three crossfading quote cards
- `OutroNextTime.tsx` — 3s three bullets, one-by-one
- `OutroFade.tsx` — 1.5s logo stamp + fade to black

**Conventions to follow:**
- Use existing primitives: `SceneBackground`, `AnimatedText`, `KineticText`, `LogoReveal`, `GlassCard` from `video/src/components/`.
- Re-use `colors` from `video/src/theme.ts` (primary `#2196F3`, etc.). No new colors.
- Use `useCurrentFrame` + `interpolate` + `spring` for animations, consistent with `CTAScene.tsx`.
- For `OutroTools.tsx`, draw the pipeline as a row of 5 glass-cards with a connecting line behind them. Stamps appear with `spring` easing. Single percussive beat per node would require audio track editing — skip that, rely on visual motion.
- For `OutroOutput.tsx`, reuse `mockups/step3-education-goal.png` as the "App" thumbnail, a still from the existing promo for "Promo", and a styled terminal card for "Tests".
- Follow the `remotion-best-practices` skill when building animations.

**Do NOT touch yet:** `AppPromo.tsx`, `Root.tsx`, `theme.ts` durations. Wiring comes in Session 3.

**Verification:** Boot `bun run dev` inside `video/`, add a temporary composition for each outro scene in `Root.tsx`, preview each card in Remotion Studio. Visual proof each scene renders.

---

### Session 3 — Wire outro into AppPromo + re-render `[critical]`

**Goal:** The outro plays at the end of the promo, composition duration is extended, MP4 re-renders clean.

**Steps:**
1. In `video/src/theme.ts`, add outro scene durations:
   ```ts
   export const SCENE_OUTRO_TITLE = { duration: 45 };      // 1.5s
   export const SCENE_OUTRO_PROBLEM = { duration: 90 };    // 3s
   export const SCENE_OUTRO_TOOLS = { duration: 270 };     // 9s
   export const SCENE_OUTRO_OUTPUT = { duration: 120 };    // 4s
   export const SCENE_OUTRO_LEARNINGS = { duration: 210 }; // 7s
   export const SCENE_OUTRO_NEXT = { duration: 90 };       // 3s
   export const SCENE_OUTRO_FADE = { duration: 45 };       // 1.5s
   ```
2. Extend `TOTAL_DURATION` from `1500` → `1500 + 870 = 2370` (79s). Matches the prior plan's ~80s target.
3. In `AppPromo.tsx`, append the 7 new scenes inside `TransitionSeries` after the `CTAScene` block, each with a `FADE_TRANSITION`.
4. Confirm `musicVolume` interpolation still fades the track properly across the new total length (`durationInFrames - 90` is still fine — it's fps-relative).
5. `bun run render` in `video/`. Output overwrites `video/out/educal-promo.mp4`.
6. Play the MP4 once locally with audio to verify.

**Critical files:**
- `video/src/AppPromo.tsx` — scene wiring
- `video/src/theme.ts` — durations
- `video/src/Root.tsx` — durationInFrames

**Verification:** `video/out/educal-promo.mp4` is ~79–80s, has audio, plays cleanly through the 5 new outro cards.

---

### Session 4 — Export the backup slide PNG `[critical]`

**Goal:** A single 1920×1080 PNG that is the composite 5-card view, to drop into PowerPoint as a full-bleed slide.

**Steps:**
1. Add a new composition `OutroSlide` in `video/src/Root.tsx` — a single-frame composition (`durationInFrames={1}`) that renders a **2×3 grid** (Option A from the prior plan): PROBLEM / TOOLS / OUTPUT in top row, LEARNINGS / NEXT TIME / EduCal logo in bottom row.
2. Create `video/src/scenes/OutroSlide.tsx`. Reuse the same card components built in Session 2, just arranged in a 2×3 CSS grid and disabled of all timed animations (drive them with `frame = lastFrame` so they render in their final state).
3. Add to `video/package.json` scripts:
   ```json
   "slide": "remotion still src/index.ts OutroSlide out/educal-slide.png"
   ```
4. `bun run slide` → verify `video/out/educal-slide.png` exists at 1920×1080.

**Critical files:**
- `video/src/Root.tsx` — new composition
- `video/src/scenes/OutroSlide.tsx` — new file
- `video/package.json` — new `slide` script

**Verification:** PNG opens in any image viewer, looks readable at full-screen on a typical laptop display.

---

### Session 5 — Build the PowerPoint deck `[critical]`

**Goal:** One `.pptx` file with the exported PNG as a full-bleed background on a single slide. Backup video embedded or linked locally.

**Steps:**
1. Use the `anthropic-skills:pptx` skill to scaffold `docs/educal-presentation.pptx`:
   - 1 slide, 16:9, no title bar, PNG from Session 4 placed as full-bleed background.
   - Optional: add the `video/out/educal-promo.mp4` as an embedded media object on the same slide (PowerPoint can embed MP4; size risk: could bloat the file past 100 MB).
   - If embedding is too heavy, keep the MP4 separate and play it in mpv instead (Session 6 covers this).
2. Open the file in PowerPoint locally to verify layout survives the round-trip.

**Critical files:**
- `docs/educal-presentation.pptx` — new file

**Verification:** Opens in PowerPoint, slide fills the screen, text is readable from the back of a room (or at 720p over a Teams share).

---

### Session 6 — MS Teams + mpv playback rehearsal + fallback recording `[critical]`

**Goal:** The exact tech stack for presentation day is proven to work, and an insurance fallback exists.

**Steps:**
1. **Video player choice.** Install / open `mpv` (preferred — lighter, always-on-top option) or VLC. Load `video/out/educal-promo.mp4`. Confirm audio plays.
2. **MS Teams screen share.** Start a Teams meeting with yourself (or a teammate):
   - Share Screen → pick the display with mpv full-screen (or share the mpv window directly).
   - Toggle **"Include computer sound"** — this is the critical bit. Without it, the music and any voiceover vanish on the receiver.
   - Have a remote device (phone) join the meeting to verify what the audience actually hears/sees.
3. **Fallback: record a Maestro walkthrough** (~30–60s, no audio) on Pixel 6a via Expo Go using the flow referenced in `reference_maestro_testing.md` memory. Save to `video/out/educal-maestro-fallback.mp4`. This is your "if-Gemini-flakes-live" card.
4. Write `docs/PRESENTATION_TECH_RUNBOOK.md` — a 1-page runbook: exact app list to open, toggle order, click path for sharing with sound, and what to do if audio drops.

**Critical files:**
- `video/out/educal-maestro-fallback.mp4` — new fallback recording
- `docs/PRESENTATION_TECH_RUNBOOK.md` — new runbook

**Verification:** A remote Teams joiner confirms they heard music and saw the promo at legible resolution. Runbook is short enough to glance at during setup.

---

### Session 7 — Script rehearsal + Q&A crib + live-demo decision `[critical]`

**Goal:** One out-loud pass of the 10-minute script with a timer, trimmed to fit under 9:30, with decisions locked in.

**Reference — 10-minute script skeleton** (to be appended to `docs/PRESENTATION_COPY.md` in Session 1):

| Time | Who | Beat |
|---|---|---|
| 0:00–0:15 | Vishal | Cold open: *"Every parent we know is stressed about school costs and has no real plan. We built one."* |
| 0:15–1:35 | — | **Play promo video with outro** (~80s). Do not talk over it. |
| 1:35–2:00 | Vishal | Pivot: *"You just saw everything — problem, tools, output, learnings, next time. Now let me walk you through the part that mattered most: the tool chain."* Advance to the PPTX slide. |
| 2:00–3:30 | Vishal | Walk the pipeline left→right on the slide: Stitch → Claude Code (cockpit via MCP) → Gemini **grounding** → Maestro (MCP) → Remotion. Name the specific stretch per node. **Do not say "orchestrator."** |
| 3:30–4:30 | Imam | 60s on design. Stretch: first time using Stitch. Honest line: *"AI is a phenomenal draft partner — not a production finisher."* |
| 4:30–5:30 | Kavya | 60s on testing. Natural-language → Maestro YAML via Claude Desktop. One concrete example. |
| 5:30–7:00 | Vishal | Tour rendered artifacts: live Gemini school search (grounding in action), per-child savings, dashboard chart. |
| 7:00–8:00 | Vishal | Learnings. Pull-quotes from `team-experience-data.md`. Close with the surprise: *"I didn't expect to end the week running five AI tools from one chat surface — and I didn't expect it to actually ship an app."* |
| 8:00–8:45 | Vishal | Next Time: autonomous loop, AI in CI/CD, pre-built design-system prompts. |
| 8:45–9:00 | Vishal | Pitch close: *"Five tools, one chat, one week — a real app for real parents."* |
| 9:00–10:00 | All | Q&A buffer. Offer live demo if time/audience permits. |

**Steps:**
1. Rehearse out loud once with a timer. If you run past 9:30, cut from Imam/Kavya jump-ins (3:30–5:30) — shorten to 45s each. Second cut: tighten 5:30–7:00 artifact tour.
2. Write `docs/QA_CRIB.md` — one-page crib for the 4 most likely questions:
   - *"How long did this really take?"* → *~2 days of code, ~4–5 days end-to-end including planning, mockups, collab and test.*
   - *"What did MCP actually do?"* → *Gave us one chat surface to reach every tool. Claude Code talked to Stitch, Maestro, Remotion. Claude Desktop talked to Maestro during test authoring. No autonomous loop — we drove it manually.*
   - *"Can we use this at Labor Solutions?"* → *The architecture is generic. Swap Gemini for any LLM, swap Expo for any stack, the cockpit pattern holds.*
   - *"Which part was hardest?"* → *Getting the Gemini grounding to return localized pricing without hallucinating. We ended up constraining the prompt tightly.*
3. **Live-demo decision:** go through the 4-point checklist from the prior plan (screen mirror verified? Gemini < 5s on Teams connection? app seeded? rehearsed tap path?). Decide y/n, write the answer at the top of `docs/PRESENTATION_COPY.md`.

**Critical files:**
- `docs/QA_CRIB.md` — new
- `docs/PRESENTATION_COPY.md` — add top-of-file "live-demo y/n" decision

**Verification:** One full rehearsal run came in under 9:30 on the timer.

---

### Session 8 — Freeze + backup `[critical, final]`

**Goal:** Nothing can be accidentally broken between now and the meeting.

**Steps:**
1. Freeze `src/` — no code changes except blocking bug fixes.
2. Copy deliverables to a USB stick AND a cloud folder:
   - `video/out/educal-promo.mp4`
   - `video/out/educal-slide.png`
   - `video/out/educal-maestro-fallback.mp4`
   - `docs/educal-presentation.pptx`
   - `docs/PRESENTATION_COPY.md`
   - `docs/QA_CRIB.md`
   - `docs/PRESENTATION_TECH_RUNBOOK.md`
3. Open `educal-presentation.pptx` in PowerPoint on the presenter machine, load the promo in mpv, verify you can walk the happy path without touching anything in `src/`.

**Verification:** All files present in both backup locations. A dry run of "open PPT → open mpv → start Teams call" works from a cold start.

---

### Session 9 — Polish: autonomous-loop teaser `[polish]`

**Goal:** A tiny live demo of the "next time" promise — a 30-second Ralph-style autonomous loop running one iteration. *Only* if Sessions 1–8 are done with time to spare.

- A single shell script that asks Claude Code to read the app state, propose a change, apply it, run Maestro, and loop. One cycle visible. Used as a surprise reveal during Q&A if the audience asks "could you have automated it?".
- Do not rehearse this into the main 10 minutes — it's a Q&A flex only.

---

## Critical files & assets (reference map)

| Thing | Path |
|---|---|
| Rendered promo video | `video/out/educal-promo.mp4` |
| Backup slide PNG | `video/out/educal-slide.png` *(new, Session 4)* |
| Fallback Maestro walkthrough | `video/out/educal-maestro-fallback.mp4` *(new, Session 6)* |
| PowerPoint deck | `docs/educal-presentation.pptx` *(new, Session 5)* |
| Frozen copy / script | `docs/PRESENTATION_COPY.md` *(new, Session 1)* |
| Q&A crib | `docs/QA_CRIB.md` *(new, Session 7)* |
| Tech runbook | `docs/PRESENTATION_TECH_RUNBOOK.md` *(new, Session 6)* |
| Remotion scene sources | `video/src/scenes/` — existing + 7 new outro files (Session 2) |
| Team experience quotes (source of truth) | `team-experience-data.md` |
| App mockups | `mockups/step*.png`, `mockups/insights-*.png`, `mockups/school-detail-*.png` |
| Gemini service (the AI core for the demo) | `src/services/gemini.ts` |
| Design tokens (colors, spacing) | `video/src/theme.ts`, `docs/DESIGN_SYSTEM.md` |

---

## Open decisions (log as they lock in)

| # | Decision | Status |
|---|---|---|
| 1 | Slide tool | PowerPoint ✅ |
| 2 | Lead angle | "Five tools, one chat, MCP as the wiring" ✅ |
| 3 | Video format: outro + PNG export | Yes — full polish path ✅ |
| 4 | Live demo y/n | Defer to Session 7 rehearsal |
| 5 | Presenter location | Remote via MS Teams ✅ |
| 6 | Video playback tool | mpv preferred, VLC fallback ✅ |
| 7 | QR / link on slide | No ✅ |
| 8 | Ralph-style autonomous loop demo | Polish-only, Session 9 |

---

## Global verification (how we know the whole plan worked)

- **Before the meeting:** one full script pass under 9:30 on a timer, with the promo playing in mpv inside a test Teams call, and a remote joiner confirming they heard and saw it clearly.
- **In the meeting:** audience reaction at the 1:05 mark (promo ending) — if they lean in, the composition story is landing; if they check phones, pivot harder to the live demo.
- **After:** capture a 2-line journal entry on what was asked. That's the real signal for "next time."
