# WebPPT Skill

This file is written for AI coding agents. Read it before modifying this project.

## Positioning

WebPPT is an AI-native interactive presentation template. Its core value is live explanation: animated pages, switchable visual styles, formulas, control panels, canvas demos, and version-controlled HTML that can be changed through natural-language instructions.

Do not turn the project into a video-only workflow. Video export is an optional companion path.

## Current Project Shape

- The active deck is `index.html`.
- The current runtime is a standalone HTML page using CDN-loaded Tailwind, React, Babel, Framer Motion, and KaTeX.
- Vite is still used for local dev, build, and preview.
- `assets/nanjing-university-logo.png` is the default watermark asset.
- `src/` may exist from an earlier implementation, but the active template is the inline React deck in `index.html`.
- `app.js` and `styles.css` are legacy files and should not be reintroduced unless the user explicitly asks for a static non-React version.

## Editing Workflow

1. Identify the requested presentation type.
   - Academic report: background, theory, formula, experiment or simulation, conclusion.
   - Teaching deck: concept, visual intuition, worked example, misconception, summary.
   - Research update: goal, result, bottleneck, next step, risk.
   - Product or project report: pain point, solution, process demo, metrics, roadmap.
   - Data analysis: overview, filters, trend, interpretation, recommendation.
   - Defense or proposal: claim, novelty, feasibility, challenge response, closing.

2. Modify the deck from the existing structure.
   - Update `SLIDE_TITLES` for page names.
   - Update `SLIDE_SECTIONS` for sidebar section dividers.
   - Update `renderSlideContent(id)` for slide content.
   - Keep `TOTAL_SLIDES` derived from `SLIDE_TITLES.length`.
   - Keep keyboard navigation, fullscreen handling, sidebar toggle, theme toggle, and watermark toggle working.

3. Design interactions with explanatory value.
   - Sliders must change a visible parameter, threshold, time, or weight.
   - Buttons must change mode, state, dataset, or displayed layer.
   - Timeline cards should expand smoothly without heavy `height: auto` animation.
   - Canvas demos must render a non-empty default image and keep pointer events from blocking controls.
   - Fullscreen mode should be visually clean and should not make text smaller.

## Visual Rules

- Keep typography large enough for live presentation.
- Prefer clear hierarchy over dense text.
- Avoid pure text pages when the subject can be shown through cards, formulas, diagrams, timelines, controls, or canvas.
- Keep theme switching coherent across Academic, Web3 Cyber, and Y2K Dreamcore styles.
- Watermarks should support brand identity without obscuring content.
- Use motion where it clarifies meaning; avoid animations that cause repeated remounting or layout jank.

## Narration Notes And Video Companion Workflow

When the user wants a talk-through or a video version, add a lightweight narration-notes layer instead of replacing WebPPT with a video pipeline.

Recommended structure:

```json
{
  "slides": [
    {
      "index": 0,
      "title": "首选项与概览",
      "durationSec": 18,
      "speakerNotes": "用一句话介绍 WebPPT 的定位，并指出它不是传统 PPT。",
      "actions": [
        { "atSec": 4, "type": "theme", "value": "dreamcore" },
        { "atSec": 10, "type": "next" }
      ]
    }
  ]
}
```

Guidance for AI agents:

- Store narration notes as `script.json`, `video-script.json`, or a `speakerNotes` field in the slide configuration if the user asks for video support.
- Each note should be short enough to read aloud naturally.
- Add `durationSec` so an automated recorder can pace the deck.
- Add `actions` for interactions that matter: page navigation, theme changes, slider updates, timeline expansion, and reset events.
- Use Playwright or another browser automation layer to load the deck, execute the timed actions, and capture the screen.
- Pair the recording with human audio or TTS. Keep the original interactive HTML as the canonical source.

## Checks

- Run `npm run build` after structural changes.
- Check the page directly in a browser after significant UI changes.
- Confirm sidebar navigation, theme switching, watermark switching, fullscreen exit, and interactive controls.
- Run `git diff --check` before committing.
