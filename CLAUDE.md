# Ginger's Creative Ventures — site guide

Plain HTML, CSS, and vanilla JS. No framework, no build step, no npm install.
Deploys to Netlify by pointing it at this repo root (see `netlify.toml`).

## The concept

The site is a house of worlds, not a portfolio. Collections are rooms you
enter, not grids you scan. Nobody "views a gallery" here — they step
through a door. This shapes both the structure and the writing:

- **Homepage** — a cinematic title card, not a homepage. One full-bleed
  hero, the studio name small and quiet, one line of copy, one "enter"
  link. No nav bar.
- **Gallery index** (`gallery.html`) — the hall of doors. Two wings:
  **Whisky Woven** (dark fantasy) and **Commissioned Worlds** (client
  work). Each collection is a full-viewport "door" image with a title
  overlaid.
- **Room template** — one reusable page layout, duplicated per collection
  (see "Adding a new room" below), for a scrolling sequence of
  full-viewport image panels with short overlaid captions.
- **Commissions** — one quiet, persistent link on every page except the
  homepage (which gets a single small corner link instead of a nav bar),
  plus a short **Artist** page.

## Design rules

These are load-bearing. Keep new pages consistent with them.

1. **Full-bleed, full-viewport.** Image panels are edge to edge, `100vh`
   (`100svh` on mobile to dodge the iOS address-bar jump). No cards, no
   borders, no visible grid, no drop shadows. If you're tempted to put an
   image in a box, don't.
2. **Text overlays imagery, always**, behind a soft gradient scrim (see
   `.scrim--bottom` / `.scrim--full` in `css/style.css`). Text never sits
   in its own block below an image.
3. **Type**: `Fraunces` (serif, loaded from Google Fonts) for anything
   with presence — titles, captions, taglines. System sans
   (`--font-sans`) for small UI microcopy (nav links, kickers, index
   numbers). High contrast, generous scale, minimal chrome.
4. **Every room owns its palette.** `--room-1`, `--room-2`, `--accent`
   are CSS custom properties set on `<body style="...">` (see any file in
   `/rooms`). Crossing into a room shifts the site's ambient color.
   Whisky Woven rooms run dark and moody; Commissioned Worlds rooms run
   cinematic but lighter. The "house" pages (home, hall, commissions,
   artist) use the default warm-neutral tokens in `:root`. Current
   palette:

   | Room | room-1 | room-2 | accent |
   |---|---|---|---|
   | House (default) | `#0a0a0a` | `#1a1712` | `#cbb98a` |
   | Hall / commissions / artist ambient | `#0e0d0c` | `#221f1a` | `#cbb98a` |
   | Shadow Court Stranger | `#0a0810` | `#241633` | `#b48be0` |
   | Sloan and the Hollow Prince | `#070c0a` | `#123128` | `#5fcf9f` |
   | Victor and Sophia | `#0d0708` | `#3a0f1e` | `#d9668c` |
   | Peace of Mind | `#12161c` | `#324153` | `#a8d8ff` |
   | URGE | `#1c1224` | `#5b2f73` | `#ff9fd0` |

5. **Motion**, all defined in `css/style.css`:
   - Slow, near-imperceptible Ken Burns drift on every image panel
     (`.media`, `@keyframes kenburns`, ~26–30s, alternating). Nothing
     ever sits perfectly static.
   - Scroll-triggered fade-and-rise reveals (`.reveal` / `.is-visible`,
     driven by `js/main.js`'s `IntersectionObserver`) so panels arrive
     one at a time as you scroll, not all at once.
   - Entering a room reads as a camera move, not a page load: a
     full-screen "veil" (`.veil`, in every page, driven by
     `js/transitions.js`) covers the screen in the destination room's
     colors before navigating, then fades away on the new page. Set
     `data-veil-1` / `data-veil-2` on any `<a class="transition-link">`
     to the destination's `--room-1` / `--room-2` so the dissolve moves
     toward where you're headed. This is a deliberate simplification of
     "cross-dissolve on the door image" — worth upgrading to a real
     image cross-fade (e.g. via the View Transitions API) once actual
     photography replaces the placeholder gradients.
   - Door hover (`.door:hover`): the image brightens slightly and drifts
     (scale), the title lifts a few pixels.
   - **`prefers-reduced-motion: reduce` is respected globally** — see the
     media query at the bottom of `css/style.css`. It collapses all
     animation/transition durations to near-zero and turns off Ken Burns
     entirely. Don't bypass it with hardcoded durations in new JS; if you
     add a new animated element, let it inherit `--dur-*` variables or
     add it to that media query.
6. **Voice.** Microcopy is in-world and invitational. Never "View
   gallery," "Portfolio," or "Browse." Use "Step through," "Enter,"
   "Step inside," "Return to the hall," "Another door," and similar.

## File structure

```
index.html              homepage (title card)
gallery.html             the hall of doors
commissions.html         quiet commissions page
artist.html               short artist bio
rooms/
  shadow-court-stranger.html      Whisky Woven
  sloan-and-the-hollow-prince.html Whisky Woven
  victor-and-sophia.html           Whisky Woven
  peace-of-mind.html               Commissioned Worlds
  urge.html                        Commissioned Worlds
css/style.css            everything — tokens, layout, motion, components
js/main.js               scroll reveal (IntersectionObserver)
js/transitions.js        the veil / room-entry transition
images/                  empty — real photography goes here
netlify.toml             publish = "." (no build step needed)
```

## Sealed doors (rooms not open yet)

A room that doesn't have a finished page yet still gets a door in
`gallery.html`, but as a **sealed door**: same door image, title, and
kicker, but no link and no hover invitation. Use `<div class="door
door--sealed reveal">` instead of `<a class="door ...">` (no `href`, no
`transition-link`, no `data-veil-*`), and add a `.door__teaser` line
after the title in place of whatever an open door doesn't need:

```html
<div class="door door--sealed reveal" style="--door-1:...; --door-2:...; --accent:...;">
  <span class="door__media" aria-hidden="true"></span>
  <span class="scrim scrim--bottom" aria-hidden="true"></span>
  <span class="door__label">
    <span class="door__kicker">Whisky Woven</span>
    <span class="door__title display">Room Title</span>
    <span class="door__teaser">A short in-world line standing in for the entry link.</span>
  </span>
</div>
```

`.door--sealed` dims and desaturates the placeholder image and disables
the hover brighten/lift so the door doesn't promise an entrance it can't
deliver yet. When the room's page is finished, swap the `<div>` back to
an `<a class="door reveal transition-link">` with `href` and
`data-veil-1` / `data-veil-2`, drop `door--sealed` and `.door__teaser`,
and it becomes a normal open door.

## Adding a new room

1. Copy an existing file in `/rooms` as a starting point.
2. Give the `<body>` a new palette: `style="--room-1:...; --room-2:...; --accent:...;"`.
   Pick colors that fit the wing (dark/moody for Whisky Woven, lighter/
   cinematic for Commissioned Worlds) and record them in the palette
   table above.
3. Update the title panel (`.panel--title`), the image panels, and the
   closing panel's "Another door" link (point it at whichever room
   should follow — the current order loops through all five and back to
   the first).
4. Add a matching door to `gallery.html`: an `<a class="door reveal
   transition-link">` with `--door-1` / `--door-2` / `--accent` inline
   styles and matching `data-veil-1` / `data-veil-2` attributes.
5. Every page's `<div class="veil" data-veil>` and `<script>` tags at the
   bottom must stay — they're what make the transitions and reveals work.

## Swapping in real images

Right now every `.media`, `.door__media`, and hero background is a CSS
placeholder gradient built from `--room-1` / `--room-2`. To swap in a real
photo, add an inline style (or a small CSS rule) to that specific element:

```html
<div class="media" style="background-image: url('../images/scs-01.jpg'); background-size: cover; background-position: center;"></div>
```

The gradient stays as a `background` fallback underneath since
`background-image` paints over it. Keep the Ken Burns animation — it
still works on a real photo. Once photos are in for a room, you can drop
that room's `.media--pos-b` placeholder-variety class if it looks better
without it.

## Content placeholders

Every caption reading "Replace this line with a caption..." and every
intro line reading "One line of in-world introduction... goes here" is a
literal placeholder, not filler lore — search for "Replace this" or "goes
here" across `/rooms` and the content pages to find them all.
