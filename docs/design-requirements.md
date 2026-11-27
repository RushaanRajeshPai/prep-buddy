# Design requirements

These are acceptance criteria for implementation, not claims about an existing UI.

## Theme

- Current implementation is light mode only, as requested; no theme toggle or dark-mode work.
- White/warm neutral surfaces, dark readable text and one restrained green accent; no gradients.
- Semantic CSS tokens for surfaces, text, borders, accent and focus.
- Keep the reserved theme directory for a future explicitly requested theme phase.

## Responsive experience

- Mobile-first layouts; use available viewport width, not device-name detection.
- Phones: compact navigation, vertically stacked panels, reachable voice controls and optional transcript drawer.
- Tablets/iPads: adaptive split panels where space permits; portrait/landscape and touch support.
- Laptops: conversation and contextual practice controls side by side.
- Large monitors: bounded reading widths with wider supporting panels; avoid stretching chat text across the screen.
- Do not hide session controls behind the on-screen keyboard; respect safe areas and dynamic viewport height.
- No horizontal overflow, clipped transcript content, hover-only controls or orientation lock.

## Accessibility and voice

- Keyboard navigation, visible focus, descriptive names and screen-reader status updates.
- Aim for WCAG 2.2 AA contrast; respect reduced motion and comfortably sized touch targets.
- Text conversation remains usable when microphone access is denied or unsupported.
- Visible microphone, listening, thinking, speaking, muted and disconnected states.
- Captions/transcript, stop-speaking, mute and leave/end-session controls.
- Explicit recording consent and a clear indication when recording is active.

## Verification plan

Test representative viewport widths of 320, 375, 768, 1024, 1440 and 1920 CSS pixels plus a wide desktop viewport; check portrait/landscape, zoom and keyboard interactions. Exercise Safari/iOS, Chrome/Android and desktop browsers, with permission denial and reconnects once voice is implemented. Verify light mode for the current phase. Real-device voice testing remains necessary; viewport emulation alone is insufficient.
