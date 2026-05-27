# AI Guide for WebPPT

This file is written for AI coding agents that need to create or modify a WebPPT deck from user instructions.

## Positioning

WebPPT is an AI-native, interactive web presentation template. Its main advantage is not video production or automatic narration. Its advantage is that a browser page can become a live presentation surface with formulas, canvas simulations, parameter controls, state panels, and reusable page structures.

When editing this project, optimize for a presenter who explains ideas live and changes variables on screen.

## Workflow

1. Identify the report type.
   - Academic report: background, theory, formula, experiment or simulation, conclusion.
   - Teaching deck: concept, visual intuition, worked example, misconception, summary.
   - Research update: goal, result, bottleneck, next step, risk.
   - Product or project report: pain point, solution, process demo, metrics, roadmap.
   - Data analysis: overview, filters, trend, interpretation, recommendation.
   - Defense or proposal: claim, novelty, feasibility, challenge response, closing.

2. Pick page patterns before writing details.
   - Use cards for definitions, assumptions, arguments, and conclusions.
   - Use formula pages when equations are central to the story.
   - Use timeline pages for stages, milestones, history, and workflow.
   - Use comparison pages for alternatives, limitations, and tradeoffs.
   - Use interactive demo pages whenever the topic has parameters, states, processes, probability, geometry, simulation, or before/after contrast.

3. Design at least one meaningful interaction for complex content.
   - Sliders should change a parameter, threshold, time, or weight.
   - Segmented controls should switch model, algorithm, dataset, or viewpoint.
   - Toggles should show or hide a meaningful layer.
   - Stepper controls should advance a derivation or process.
   - Randomize buttons should resample probability or simulation states.
   - Compare buttons should switch between hypotheses, plans, or before/after states.

4. Verify the page structure.
   - Every slide is a `.page-content` section.
   - Every slide has `data-nav`, `data-part`, and `data-part-title`.
   - Use `data-group-start="true"` when a slide starts a new part in the sidebar.
   - Keep the deck static: it should run by directly opening `index.html`.

## Visual Rules

- Keep the default style light, academic, and readable.
- Use the existing style templates when the user asks for a different tone: `theme-sky`, `theme-emerald`, `theme-violet`, or `theme-rose`.
- Do not use dark video-style scenes as the main page background.
- Avoid pure text slides. A slide should contain structure: cards, tables, formula blocks, timelines, or an interactive visual.
- Canvas demos must render a non-empty default state before user input.
- Controls must visibly affect the canvas or preview area.
- Fullscreen mode must never make titles, body text, controls, or formulas smaller than normal mode.

## Implementation Rules

- Edit `index.html` for slide structure and page content.
- Edit `styles.css` for reusable visual components.
- Edit `app.js` for navigation, background animation, and demo logic.
- If adding a new style template, add the CSS variables in `styles.css` and register the option in the `style-mode` select.
- Prefer small, explicit JavaScript functions over framework dependencies.
- Keep IDs unique when adding controls.
- If adding a new canvas demo, include a refresh function that runs when the slide becomes visible.
- If using MathJax, write formulas directly in HTML with `$...$` or `$$...$$`.

## Acceptance Checklist

- The deck opens directly from `index.html`.
- Sidebar navigation discovers all pages automatically.
- Keyboard navigation and fullscreen still work.
- The dynamic demo has pause, reset, and at least one parameter control.
- Every new control changes visible state.
- README explains the project to humans.
- This file explains the project to AI agents.
