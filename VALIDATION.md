# Stratova Coffee revision — validation

- Palette and typefaces read directly from the current Stratova homepage: wine #521D2C, paper #F7F4EE, charcoal #292524, taupe #D8CDC8; Syne and Hanken Grotesk. Font files and SIL OFL notices bundled locally.
- Main website, original SVG artwork, card, overview, showcase, reel captions and closing composition rebranded. Source scan found no Little Ritual names or original orange/caramel theme hex values in the new site.
- Static production build passed: 21 source files checked for page titles, local references and JS syntax; `dist/` generated.
- Visual review at 1280px desktop, 1960px capture width, 768px tablet, 390px mobile and 360px narrow mobile. Horizontal overflow checks returned false at these widths. The actual website capture contains 510 consistently sized 1960 × 1180 frames.
- Branded mobile menu opens and follows the Coffee link. Product dialog shows the correctly branded Morning Person pack and data, and Escape closes it. Smooth + Filter correctly suggests Slow Sunday and a medium grind. The brand revision does not change the matching algorithm, whose full nine combinations were checked in the earlier version.
- Reduced-motion override reviewed with the branded font/layout. Native OS media support remains in place; the OS preference itself was not changed for this revision.
- Overview screenshot assets load and use the actual new implementation. Heading computed font is Syne. New concept/overview/showcase routes resolve on the static preview.
- Source frame contact sheet inspected for hero, connected transition, packaging, real product modal, brewing and story before encoding. The screenshot crop uses current document scroll position.
- Both final exports are checked by `render/verify.py`: dimensions, 9:16 ratio, 20s duration, 600 frames, 30fps, H.264/yuv420p and complete error-free decoding. See `video-verification.json` for measured output values and `reel-review.jpg` for final-export contact sheet.

- Branded showcase guide completed its 20-second sequence; closing frame was visible with measured RGB(82,29,44), and Stop worked.
- Actual 4K browser playback: readyState 4, 2160 × 3840 intrinsic resolution, observed time 19.29/20 seconds, no media error. Final-export contact sheet inspected for correct brand and all story stages.

## Continuing limits

No live repository was supplied, so this is a standalone revision with integration instructions. Existing production filters, router, sitemap and actual deployment have not been changed or tested. No push, merge or deployment was performed.

The reel is a target-resolution 4K composition with high-resolution website captures. Its generated unbranded laptop photo plate is enlarged from 941 × 1672; the photographic scene is not entirely native 4K, and synthetic keyboard-lettering imperfections remain. The exact bezel handle is typeset by code.

No Lighthouse score or full automated accessibility certification is claimed. The earlier in-app browser emitted a MutationObserver instrumentation error during iframe lifecycle checks, with no matching MutationObserver source in this website. Manual showcase interactions completed; normal Chrome/Safari staging checks remain appropriate.

The coffee catalogue and prices remain fictional. No payment processor or real coffee-business claims are included.

## Continuous bean motion revision

- Replaced generic section-fade activation and the small hero shift with a shared cast of three scroll-driven beans in `journey.js`.
- Inspected native downward scrolling at the hero divider and catalogue, the measured brewer drop, and the final resting positions beside the new cup. Desktop and mobile have separate-sized paths; mobile checkpoints follow the three stacked bags.
- Reverse-scroll check: returning to scroll position 600 at the same viewport reproduced the same three recorded centres (950.3/336.7, 885.5/373.7, 1042.3/250.8), confirming the route follows scroll position rather than one-time reveal triggers.
- Mobile 390px and narrow 360px horizontal overflow checks passed. Beans remained visible beside the second mobile bag around scroll 1941. Reduced-motion mode hid the travelling layer and retained visible static hero beans.
- Decorative layer confirmed `aria-hidden=true` and `pointer-events:none`. Product dialog opened through the layer; Escape closed it and restored focus to its product button.
- Normal concept console inspection returned no warnings/errors at the checked point.
- Updated 20-second guide completed; real pointer interaction inside the iframe stopped it. Its scroll timeline now passes continuously through the bean route instead of section timer jumps.
- 510 fresh 1960 × 1180 website frames checked for consistent dimensions. Source contact sheet inspected for oversized divider crossing, collection, brewer descent/grounds, story crossing and final cup settlement.
- Static build/check passes across 22 site files. No animation library or production video dependency added. `bean-journey-preview.mp4` is the direct 17-second screen capture, separate from the live website bundle.
- Final video dimensions, duration, frame count, codec and full-decode checks are recorded in the regenerated `video-verification.json`. Updated final-export contact sheet is `reel-review.jpg`.

- Revised 4K export played through to 20/20 seconds in the browser, readyState 4, ended=true, with no media error. Both 20-second reels and the 17-second direct preview passed full decoding and format checks. Temporary video-QA files were removed from the website before the final build.
