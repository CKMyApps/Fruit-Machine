# Fruit Machine
Independent retro web game inspired by the 1983 Spectrum book. Virtual credits only. No purchases or prizes. Optional PayPal donations do not affect the game.

Open index.html locally, or deploy all files at the root of a GitHub Pages repository. HTTPS is required for installation and offline caching. On iOS use Safari > Share > Add to Home Screen. On Android use the browser's install option when offered. Local progress is isolated by a dedicated localStorage key. Starting a new game replaces saved progress after confirmation.

Rules: 100 starting credits, 10 per spin, exact pairs as listed in the game; payouts are additive. The exact-two-diamond rule is used rather than the inconsistent printed instructions. All four symbols are equally likely and independent. No original code or assets copied. The original authors are credited via the book attribution. Audio is synthesized locally.

Run `node test.js` for payout tests. Browser and device installation require manual verification.
