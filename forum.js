// Forum tab (formerly "Home"): tonight's-sky strip, category chips, thread feed.
// Owns its own thread data so this feature can be developed independently.
const Forum = {
  name: 'Forum',
  template: `
    <div>
      <div class="sky-strip">
        <div class="sb-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18 7 7 0 0 1 0-18z" fill="#c084fc" fill-opacity="0.25" stroke="none"/></svg>
        </div>
        <div class="sky-strip-text">
          <div class="sky-strip-title">Waxing gibbous, 78% lit</div>
          <div class="sky-strip-sub">Good night for Saturn, rises 21:40, Bangkok sky</div>
        </div>
        <div class="sky-strip-cta">TONIGHT'S SKY</div>
      </div>

      <div class="chip-row">
        <div class="chip" :class="{ active: activeChip === 'All' }" @click="activeChip = 'All'">All</div>
        <div class="chip" v-for="tag in tags" :key="tag" :class="{ active: activeChip === tag }" @click="activeChip = tag">{{ tag }}</div>
      </div>

      <div class="section">
        <div class="section-eyebrow-row">
          <span class="section-label">Following</span>
          <div class="section-rule"></div>
          <span class="section-link">See all</span>
        </div>
        <div class="thread-list">
          <div class="thread-card" v-for="t in filteredThreads" :key="t.id">
            <div class="thread-head">
              <div class="avatar" :style="{background: t.color}">{{ t.initial }}</div>
              <div class="thread-meta">
                <div class="thread-author">{{ t.author }} <span class="lvl">{{ t.level }}</span></div>
                <div class="thread-sub">{{ t.time }}, {{ t.replies }} replies</div>
              </div>
              <div class="thread-tag">{{ t.tag }}</div>
            </div>
            <div class="thread-title">{{ t.title }}</div>
            <div class="thread-body">{{ t.body }}</div>
            <div class="thread-foot">
              <div class="stat" :class="{solved: t.solved}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>{{ t.replies }}</div>
              <div class="stat"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>{{ t.upvotes }}</div>
              <div class="spacer"></div>
              <div class="stat solved" v-if="t.solved"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Solved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      activeChip: 'All',
      tags: ['Beginner Q&A', 'Equipment', 'Astrophotography', 'Deep Sky', 'Solar System', 'News'],
      threads: [
        { id: 1, author: 'galileo_jr', initial: 'G', color: '#7c3aed', level: 'Lv. 4', time: '2h ago', replies: 14, upvotes: 38, tag: 'Equipment', title: "Is a 6\" Dobsonian enough to actually see Saturn's rings, or am I being too hopeful?", body: "Picking up a used Apertura AD6 this weekend. Mainly want planetary views from a Bortle 5 backyard, realistic expectations for Saturn and Jupiter at 150x?", solved: false },
        { id: 2, author: 'nebula_noor', initial: 'N', color: '#a855f7', level: 'Lv. 9', time: '5h ago', replies: 27, upvotes: 102, tag: 'Astrophotography', title: 'First decent capture of the Orion Nebula, 2hr integration, stacked in Siril', body: "Finally got the cooling box working on my old DSLR. Still a lot of gradient in the corners I couldn't fully remove, tips welcome on the flat frames.", solved: false },
        { id: 3, author: 'stardust_mei', initial: 'M', color: '#5b21b6', level: 'Lv. 2', time: '7h ago', replies: 6, upvotes: 19, tag: 'Beginner Q&A', title: 'What does "magnitude" actually mean? Keep seeing it but the scale confuses me', body: "I get that lower numbers are brighter, but why are some negative? And how do I use it to figure out if something is naked-eye visible from a suburban sky?", solved: true },
        { id: 4, author: 'redgiant_theo', initial: 'T', color: '#9333ea', level: 'Lv. 6', time: '11h ago', replies: 9, upvotes: 54, tag: 'Solar System', title: 'Mars opposition prep: best filters for surface detail on a 8" SCT?', body: "Planning a session for the upcoming opposition. Currently have a basic moon filter only. Would a Wratten #21 orange make a noticeable difference for polar caps and Syrtis Major?", solved: false },
        { id: 5, author: 'pleiades_anya', initial: 'A', color: '#c084fc', level: 'Lv. 5', time: '1d ago', replies: 21, upvotes: 67, tag: 'Deep Sky', title: 'Pleiades nebulosity: am I actually seeing the reflection nebula visually?', body: "Through my 8\" dob last night under fairly dark skies I thought I caught faint wisps around Merope. Could this realistically be visual, or is it more likely scatter/eye strain?", solved: true },
        { id: 6, author: 'cosmic_leo', initial: 'L', color: '#f97316', level: 'Lv. 7', time: '2d ago', replies: 34, upvotes: 89, tag: 'Equipment', title: 'Best budget astrophotography camera under $500?', body: "Looking to start deep-sky with a used DSLR vs dedicated astro camera. Anyone have experience with the ZWO ASI120MC?", solved: false },
        { id: 7, author: 'lunar_emily', initial: 'E', color: '#14b8a6', level: 'Lv. 3', time: '2d ago', replies: 12, upvotes: 28, tag: 'Beginner Q&A', title: 'Why do some stars twinkle more than others?', body: "I know it's atmospheric turbulence, but Arcturus twinkles wildly while Vega is steady. Is it just altitude?", solved: true },
        { id: 8, author: 'deepsky_dave', initial: 'D', color: '#3b82f6', level: 'Lv. 12', time: '3d ago', replies: 56, upvotes: 203, tag: 'Deep Sky', title: 'First light with 16" truss dob – Veil Nebula blew my mind', body: "Observed from a Bortle 4 site. The Eastern Veil with OIII filter was like a glowing cosmic snake. Anyone else prefer unfiltered views?", solved: false },
        { id: 9, author: 'astro_jessi', initial: 'J', color: '#ec489a', level: 'Lv. 8', time: '3d ago', replies: 19, upvotes: 76, tag: 'Astrophotography', title: 'My first mosaic of the Cygnus region – 12 panels', body: "Captured with a 50mm lens and modded DSLR. Processing the seams was tough but worth it. Feedback appreciated!", solved: false },
        { id: 10, author: 'planet_hunter', initial: 'P', color: '#8b5cf6', level: 'Lv. 10', time: '4d ago', replies: 41, upvotes: 115, tag: 'Solar System', title: 'Jupiter Io transit tonight – grabbed some lucky imaging', body: "Seeing was average but caught the shadow transit. Stacked 2000 frames. Io's shadow looked like a sharp black dot.", solved: false },
        { id: 11, author: 'nova_chaser', initial: 'N', color: '#ef4444', level: 'Lv. 5', time: '4d ago', replies: 8, upvotes: 22, tag: 'News', title: 'New supernova in M101? Anyone confirm?', body: "Saw reports of a possible brightening. Checked with my 10\" dob – could be a new transient near the core. Not yet in official catalogs.", solved: false },
        { id: 12, author: 'astrophotons', initial: 'A', color: '#10b981', level: 'Lv. 11', time: '5d ago', replies: 33, upvotes: 144, tag: 'Astrophotography', title: 'Andromeda core with 135mm lens – dramatic dust lanes', body: "2 hours integration, Bortle 8. Surprised how much dust detail I could pull out with gradients removal.", solved: false },
        { id: 13, author: 'moonwatcher', initial: 'M', color: '#f59e0b', level: 'Lv. 4', time: '5d ago', replies: 7, upvotes: 18, tag: 'Equipment', title: 'Which lunar atlas is best for sketching?', body: "Printed vs app? I like sketching at the eyepiece but need a detailed reference for rilles and domes.", solved: true },
        { id: 14, author: 'exoplanet_ella', initial: 'E', color: '#06b6d4', level: 'Lv. 9', time: '6d ago', replies: 23, upvotes: 92, tag: 'Deep Sky', title: 'Transit of HD 189733b with a small telescope? Possible?', body: "Has anyone managed to detect an exoplanet transit visually or with a DSLR on a 6\" scope? I've seen tutorials but curious about real-world results.", solved: false },
        { id: 15, author: 'spacetime_steve', initial: 'S', color: '#6b7280', level: 'Lv. 13', time: '6d ago', replies: 45, upvotes: 188, tag: 'Astrophotography', title: 'My best image yet – 20 hours on the Horsehead Nebula', body: "Used a cooled astro camera and narrowband filters. The hydrogen alpha detail around Alnitak is finally controlled without halos.", solved: false }
      ]
    };
  },
  computed: {
    filteredThreads() {
      if (this.activeChip === 'All') return this.threads;
      return this.threads.filter(t => t.tag === this.activeChip);
    }
  }
};
