# AI Agent Operating Rules for Tuckit Admin Console

## Mandatory Workflow Protocol

1. **At Start of Every Task / Session:**
   - You MUST read `company level/docs/WALKTHROUGH.md` and `DESIGN.md` in full before writing any code.
   - Familiarize yourself with the established patterns: `#F97316` brand orange, Inter 500/400 type scale, hairline borders, persistent sidebar IA, and zero fake backend dependencies.

2. **During Development:**
   - Follow all P0 safety rules: PII masking by default, tiered DestructiveActionModal with required empty reason, and no artificial `.slice(0, 30/50)` caps on dropdowns.
   - Adhere strictly to DESIGN.md structural guidelines.

3. **At End of Every Task / Before Pushing:**
   - Run `npm run build` inside `company level/` to guarantee zero compilation errors.
   - Append a complete session summary record to `company level/docs/WALKTHROUGH.md` under the `Chronological Changelog & Trajectory History` section before running `git push`.
