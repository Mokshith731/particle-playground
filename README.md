# Particle Playground

An interactive particle physics playground built with vanilla HTML5 Canvas and JavaScript — no frameworks, no dependencies.

## What it does

Hundreds of particles react to your mouse (or touch) in real time. Switch between four interaction modes, tweak physics parameters live, and click anywhere to trigger a burst.

- **Gravity Well** — particles get pulled toward the cursor
- **Repel** — particles push away from the cursor
- **Swirl** — particles orbit around the cursor
- **Fireworks** — particles fall and fade like sparks, respawning continuously

Other features:
- Adjustable particle count (50–800) and force strength, updated live
- Four color palettes (Neon, Sunset, Ocean, Mono)
- Click/tap anywhere for a particle burst
- Trail-fade rendering for a smooth glowing effect
- Fully responsive, works on mobile with touch support

## How it works

Each particle is an independent object with position, velocity, and color. On every animation frame:
1. A force vector is computed based on the distance and angle to the cursor, scaled by the active mode's rule (attract, repel, or perpendicular for swirl)
2. Velocity is updated and damped slightly (`* 0.98`) so motion settles instead of accelerating forever
3. Particles wrap around screen edges instead of disappearing

The trail effect comes from painting a semi-transparent rectangle over the whole canvas each frame instead of clearing it — older frames fade instead of vanishing instantly.

## Running it

No build step needed. Just open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

- `index.html` — structure and UI controls
- `style.css` — dark theme styling and layout
- `script.js` — particle system, physics, and event handling

## Ideas for extending it

- Add sound reactivity (Web Audio API)
- Save/share custom palettes
- Add a "black hole" mode with particle destruction
- WebGL rewrite for higher particle counts
