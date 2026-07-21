# Regain Media website, deployment guide

One-page immersive site (v2, rebuilt 2026-07-21). Static, no build step. Deploy this folder as-is.

## Structure
```
site/
├── index.html          The entire site (hero, problem, live chat demo, services,
│                       process, stats, manifesto, contact, all anchor sections)
├── about.html          Redirect stub to index.html#about (kept for old links/SEO)
├── contact.html        Redirect stub to index.html#contact
├── services/*.html     Redirect stubs to index.html#services
└── assets/
    ├── css/style.css   Design system (Space Grotesk display type, ember accent,
    │                   grain overlay, marquee, card stack, phone mockup, race bars)
    ├── js/main.js      Animation engine (Lenis smooth scroll + GSAP ScrollTrigger)
    └── img/            logo.svg (favicon/mark), logo-lockup.svg (mark + wordmark)
```

## What's animated
Entrance curtain wipe, staggered hero type reveal, smooth (Lenis) scrolling, scroll progress bar,
custom cursor dot and ring, infinite marquee band, "the race" comparison bars that fill on scroll with
live-counting timers, a phone mockup that plays a full AI-agent SMS conversation when scrolled into view,
services as sticky stacking panels that scale back as the next covers them, count-up stats, manifesto
line-by-line reveals, magnetic CTA button. All gated behind `prefers-reduced-motion`.

## Contact form: Cloudflare Pages does not handle form submissions natively

Cloudflare Pages is static hosting only. There's no built-in form backend the way some other hosts have
one, so the form needs a real endpoint or it just sits there. The code is already wired for the easiest
option, Formspree, with a graceful fallback if it's not set up yet.

**To activate it (about 2 minutes):**
1. Go to formspree.io, sign up free, create a form. You'll get a form ID.
2. In `index.html`, find `action="https://formspree.io/f/YOUR_FORM_ID"` on the contact `<form>` and
   replace `YOUR_FORM_ID` with your real ID.
3. Done. The JS in `main.js` auto-detects the placeholder and only falls back to a mailto link if it's
   still unconfigured; once the real ID is in place, submissions POST to Formspree via fetch, and the
   page shows an inline "sent" message without leaving the site or reloading.

Formspree's free plan covers 50 submissions a month, plenty for a new site. If volume ever outgrows that,
either upgrade Formspree or swap in a Cloudflare Pages Function (`functions/api/contact.js`) that emails
you directly using a service like Resend, no third party dependency, but more setup.

## Deploy to Cloudflare Pages (free tier)

1. Push this `site/` folder to a GitHub/GitLab repo.
2. Cloudflare dashboard: **Workers & Pages > Create > Pages > Connect to Git**.
3. Build settings: Framework preset **None**, Build command *(blank)*, Output directory: path to this
   folder (or `/` if the folder is its own repo).
4. Deploy, you get a `*.pages.dev` URL immediately.
5. **Custom domains > Add a domain**, enter `regain.media`, follow the DNS steps shown.

## Before going live
- **Contact form**: see above, needs the Formspree ID pasted in.
- **Favicon**: done, `assets/img/logo.svg` (auto-adapts to light/dark browser themes).
  `assets/img/logo-lockup.svg` is the mark + wordmark version for proposals, invoices, social profiles.
- **Social preview (OG) image**: still none, add a 1200x630 PNG before sharing links publicly.
- **Chat demo copy**: the SMS conversation in `main.js` (the `script` array) is example copy, edit
  freely, it's plain text in JS.
- CDN dependencies: GSAP + ScrollTrigger (cdnjs), Lenis (unpkg). All free, no keys.

## Editing
All copy is in `index.html`. Colors/fonts are CSS variables at the top of `style.css`
(accent: `--ember: #ff6b2c`). Animation hooks are `data-*` attributes and the `.reveal` class, keep
them on elements unless you want that element unanimated.
