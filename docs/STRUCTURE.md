# Project structure

Quick reference for where things live and where new files should go.

## Layout

```
Cosmoklub-main/
├── index.html, object.html, team.html          Pages — stay at root,
├── staff-application.html, dashboard.html       these ARE the site's URLs
├── lesson.html, roadmap.html                    (cosmoklub.space/object.html etc.)
├── robots.txt, sitemap.xml                      Crawler config
├── README.md
│
├── assets/
│   ├── css/            One stylesheet per page, plus style.css (shared)
│   │                    and transition.css (shared page-transition anim)
│   ├── js/
│   │   ├── *.js          App/page scripts (main, common, app, course-data,
│   │   │                 planet, progress, and one script per page)
│   │   ├── components/   Vue components used inside dashboard.html
│   │   │                 (chat, forum, library, planetarium)
│   │   └── lib/
│   │       └── supabase-client.js   Client-side Supabase setup
│   ├── images/
│   │   ├── logo.png, pensia1.png
│   │   └── team/          Headshots — see team/README.txt in here
│   └── models/            All .glb 3D planet models
│
├── functions/              Cloudflare Pages Functions (serverless).
│   ├── _middleware.js       Runs on every request — bot/crawler detection
│   │                        for the AI-visibility fix (see snapshots/).
│   └── api/
│       ├── nasa.js          -> live route: /api/nasa
│       └── supabase-config.js -> live route: /api/supabase-config
│   Note: this folder's location is fixed by Cloudflare Pages, don't move it.
│
├── snapshots/               Static, crawler-facing HTML snapshots of each
│                             page's real content (used by _middleware.js
│                             so bots that don't run JS still see real text
│                             instead of the Vue app's raw {{ }} templates).
│
├── supabase/                 Database schema (.sql), not deployed as-is.
│
└── docs/
    └── STRUCTURE.md          This file.
```

## Adding new things

| You're adding...              | It goes in...                          |
|--------------------------------|-----------------------------------------|
| A new page                    | New `.html` file at root + add it to `sitemap.xml` + give it a snapshot in `snapshots/` if it should be crawlable |
| A script only one page uses    | `assets/js/<name>.js`, linked from that page |
| A script shared by many pages  | `assets/js/common.js` or a new shared file in `assets/js/` |
| A new Vue component            | `assets/js/components/<name>.js` |
| A new 3D planet/object model   | `assets/models/<Name>.glb`, then add the filename to the `PLANET_MODELS` list in `assets/js/planet.js` |
| A new team member's photo      | `assets/images/team/<next number>.png` (or `.jpg`), then add them in `assets/js/team.js` |
| Any other image                | `assets/images/` |
| A new backend/serverless route | `functions/api/<name>.js` (becomes `/api/<name>`) |
| A new stylesheet               | `assets/css/` |

## Why `assets/js/lib/supabase-client.js` and not `api/supabase-client.js`

It used to live in a root-level `api/` folder, one level away from
`functions/api/` — easy to mix up since one is a client helper and the
other is the real backend (`functions/api/` maps directly to live
`/api/*` routes on Cloudflare Pages). Moving it under `assets/js/lib/`
removes that ambiguity.
