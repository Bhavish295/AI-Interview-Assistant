# Art direction — "On Air"

Subject: a mock interview *is* a rehearsed performance — a broadcast booth, not a
quiz form. The whole product borrows the vernacular of a recording studio: a tally
light, a cue card, a VU meter, a live transcript crawling like a lower-third.
That's the signature system, used everywhere instead of generic progress rings/spinners.

## Tokens

| name    | hex     | use                                                   |
|---------|---------|--------------------------------------------------------|
| ink     | #15120F | dark theme background (warm charcoal, not flat black)  |
| panel   | #211C17 | dark theme card/surface                                |
| paper   | #F3ECDD | light theme background + cue-card surface (both themes)|
| signal  | #E8432B | primary accent — tally-light red, "on air", primary CTA |
| brass   | #CFA038 | secondary accent — scores, highlights, active states    |
| mist    | #9C9186 | muted text / labels                                     |

Dark theme = studio at night (ink/panel + signal/brass accents).
Light theme = daylight through the booth window (paper-forward, same accents).
Cue-card surfaces (auth card, question card) are **always** paper-colored, even in
dark mode — a lit card on a dark console, reinforcing the metaphor.

## Type

- Display: **Big Shoulders** (condensed, marquee/signage character) — headlines only, used at large size with tight tracking.
- Body: **IBM Plex Sans** — everything conversational (copy, labels, buttons).
- Utility/data: **IBM Plex Mono** — timer countdown, scores, live transcript, chart axes. Anything that reads as "instrument readout" is mono.

## Signature components (reused everywhere, not one-off)

- **Tally light** — small pulsing dot + "ON AIR" / "LIVE" / "REC" mono label. Used for: recording indicator, active-session badge, "you're online" states.
- **VU meter** — horizontal segmented bar (not a circular ring) for every score/confidence/metric. Segments fill left→right in `signal`→`brass` gradient.
- **Cue card** — paper-colored rounded card with a die-cut notch/hole accent top-left (like an index card on a ring), used for question display and auth forms.
- **Waveform** — animated bar waveform for voice input active state, and as a quiet ambient hero visual on the landing page.

## Layout notes

- Landing hero: marquee-style headline + live waveform as the hero visual (not a screenshot mockup or a stat-and-gradient block).
- Feature grid styled as mixing-console channel strips (vertical dividers, small mono numbering only where it's a real channel index).
- Dashboard: session history as a "tracklist" (episode list), trend chart gridlines styled like an oscilloscope, mono axis labels.
- Motion: restrained — tally light pulse, waveform bars, card entrance on question change, timer tick. No scroll-jacking, no confetti.
