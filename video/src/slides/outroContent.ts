/**
 * Single source of truth for the static backup-slide copy.
 *
 * The three backup slides (BackupSlideBuild, BackupSlideReflect,
 * BackupSlideHero) all import from here so typos and phrasing don't
 * drift between slides. This file's content is audited against
 * docs/PRESENTATION_COPY.md — if that doc changes, sync the strings
 * below too.
 *
 * Notes:
 *  - LEARNINGS here are the SHORTER slide-appropriate versions (~20 words).
 *    The full ~30-word verbatim quotes live in OutroLearnings.tsx where
 *    the scene is 19 seconds long; a still slide can't carry that much
 *    text three times over without crowding.
 *  - LEARNINGS_DISTILLED are the even-shorter ~10-word versions used
 *    only in BackupSlideHero (the single-slide alternative), because the
 *    hero slide's bottom quad cell is only 440px wide.
 */

export type PipelineNode = {
  name: string;
  micro: string;
  stamp: string;
  stampKind: "new" | "stretch";
};

export type QuoteEntry = {
  name: string;
  role: string;
  text: string;
};

export type NextBullet = {
  who: string;
  text: string;
};

// ─── Titles & chrome ───────────────────────────────────────────────────
export const BUILD_EYEBROW = "How we built it";
export const BUILD_TITLE = "Five tools. One chat. One week.";
export const BUILD_BOTTOM_STAMP = "Three deliverables. One week. Real output.";

export const REFLECT_EYEBROW = "What we learned · What's next";
export const REFLECT_TITLE = "The reflection.";
// Talk title from docs/PRESENTATION_COPY.md — echoes the opening line,
// closes the narrative loop, and avoids repeating the pitch_close tagline
// that already lives inside LogoClose.
export const REFLECT_BOTTOM_STAMP = "One week. Five firsts. One chat window.";

export const HERO_EYEBROW = "How we built it";
export const HERO_TITLE = "Five tools. One chat. One week.";
export const HERO_BOTTOM_STAMP = "A real app for real parents.";

// ─── 1 · PROBLEM ───────────────────────────────────────────────────────
export const PROBLEM_HEADLINE = "Parents can't plan for school costs.";
export const PROBLEM_SUBHEAD =
  "No localized data. No monthly number. No plan.";

// ─── 2 · TOOLS (HERO) ──────────────────────────────────────────────────
export const TOOLS_HEADER = "Five stretches. One chat. MCP as the wiring.";
export const TOOLS_BOTTOM_STAMP =
  "Manual chain today. Autonomous tomorrow.";

export const TOOL_NODES: PipelineNode[] = [
  {
    name: "Stitch",
    micro: "drafting UI/UX",
    stamp: "new · Imam",
    stampKind: "new",
  },
  {
    name: "Claude Code",
    micro: "one chat, via MCP",
    stamp: "stretch · Vishal",
    stampKind: "stretch",
  },
  {
    name: "Gemini API",
    micro: "maps + search grounding",
    stamp: "new · Vishal",
    stampKind: "new",
  },
  {
    name: "Maestro",
    micro: "YAML test flows",
    stamp: "new · Kavya",
    stampKind: "new",
  },
  {
    name: "Remotion",
    micro: "this promo video",
    stamp: "new · Vishal",
    stampKind: "new",
  },
];

// ─── 3 · OUTPUT ────────────────────────────────────────────────────────
export const OUTPUT_ITEMS = {
  app: {
    title: "App",
    caption: "3 steps → savings goal",
  },
  promo: {
    title: "Promo · 80s",
    caption: "Real footage · 1080p",
  },
  tests: {
    title: "Tests",
    caption: "Maestro E2E",
  },
};

// ─── 4 · LEARNINGS ─────────────────────────────────────────────────────
// Slide-appropriate versions (shorter than the video's 28/17/31-word quotes).
export const LEARNINGS: QuoteEntry[] = [
  {
    name: "Vishal",
    role: "Engineering",
    text: "First composition, first grounding, first Remotion — all wired into one chat via MCP.",
  },
  {
    name: "Kavya",
    role: "Testing",
    text: "Natural-language to Maestro YAML collapsed test authoring time. The AI caught edge cases I'd have missed.",
  },
  {
    name: "Imam",
    role: "Design",
    text: "Stitch is a phenomenal draft partner — but not a production finisher. Front-load the spec.",
  },
];

// Distilled versions for the single-slide BackupSlideHero only.
// Each is ~10 words — a deliberate compromise to fit the 440px hero-slide cell.
export const LEARNINGS_DISTILLED: QuoteEntry[] = [
  {
    name: "Vishal",
    role: "Eng",
    text: "First composition, first grounding, first Remotion — via MCP.",
  },
  {
    name: "Kavya",
    role: "Test",
    text: "Natural-language → Maestro YAML. AI caught edge cases.",
  },
  {
    name: "Imam",
    role: "Design",
    text: "AI drafts brilliantly. Front-load the spec.",
  },
];

// ─── 5 · NEXT TIME ─────────────────────────────────────────────────────
export const NEXT_BULLETS: NextBullet[] = [
  {
    who: "Vishal",
    text: "Next time I'm not babysitting. The AI can plan, build, test and fix itself.",
  },
  {
    who: "Kavya",
    text: "Start with AI-generated test plans. End with tests that fix themselves.",
  },
  {
    who: "Imam",
    text: "Spec first, prompt second. The tighter the brief, the closer the draft gets to production.",
  },
];

// Ultra-tight versions for the hero slide's Next Time cell.
export const NEXT_BULLETS_SHORT: NextBullet[] = [
  {
    who: "Vishal",
    text: "Autonomous loop. AI plans, builds, tests, self-corrects.",
  },
  {
    who: "Kavya",
    text: "AI-generated test plans. Self-healing Maestro flows.",
  },
  {
    who: "Imam",
    text: "Spec first, prompt second. Tighter brief, closer draft.",
  },
];

// ─── 6 · LOGO CLOSE ────────────────────────────────────────────────────
export const PITCH_CLOSE =
  "Five tools, one chat, one week. A real app for real parents.";
