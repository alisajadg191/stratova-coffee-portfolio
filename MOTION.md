# Continuous bean journey

The main scroll effect is now a single shared cast of three beans, rather than independent section reveals. The same DOM elements travel through the page and reverse their route when scrolling upwards.

## Choreography

1. Beans begin around the assembled hero cup.
2. They grow, roll and take a curved path across the wine divider into the collection.
3. They land beside the packaging; on mobile, the route follows each stacked product card.
4. They pass the preference section and arc towards the actual cafetière illustration.
5. A staggered drop shrinks the beans into the brewer, with a restrained coffee-ground effect.
6. They emerge near the mug, cross the editorial story, and settle around the new final cup composition.

Position, scale, rotation, slight depth rotation and transparency are derived from native scroll position. There is no scroll interception, pinning or normal-page autoplay. The route updates in either direction without replay triggers. Chapter anchors come from the real layout, including package boxes, the brewer opening and final cup base, and are measured again on resize/font loading.

## Files

- `site/assets/journey.js`: geometry, desktop/mobile checkpoints, interpolation, stagger, grounds and cleanup.
- `site/assets/style.css`: fixed decorative layer, transforms/shadows, final cup and reduced-motion rules.
- `site/assets/app.js`: deterministic capture timeline and existing interactions. Generic section-fade activation has been removed.
- `site/assets/showcase.js`: the explicit 20-second guide now scrolls continuously through the same measured chapter stops, rather than jumping between sections on timers. Real user input cancels it.

The render guide spends 2.3–5.8 seconds on the first bean crossing, then 8–13.4 seconds on the brewing approach/drop. It reaches the final cup before the Stratova closing frame. The direct screen preview is `bean-journey-preview.mp4`, allowing the motion to be reviewed without a laptop mockup.

## Accessibility and performance

The decorative layer is `aria-hidden` and `pointer-events:none`; it does not alter focus order or block product actions. Reduced motion hides the travelling layer and retains static hero beans and content. Mobile uses smaller beans and additional checkpoints through its taller catalogue. The layer is clipped to the viewport, so it cannot create horizontal overflow.

Normal browsing schedules one requestAnimationFrame only when scrolling, with movement applied through transforms/opacity. ResizeObserver watches the main layout; fonts and resize trigger remeasurement. Observers/listeners are cleaned up on page exit and restored for back/forward cache return. Offscreen steam remains paused by IntersectionObserver. No animation library or live video dependency was added.
