// Library tab: astronomy lessons grid + the user's saved objects.
// Owns its own lessons/savedItems data so this feature can be developed independently.
const Library = {
  name: 'Library',
  template: `
    <div>
      <div class="section">
        <div class="section-eyebrow-row">
          <span class="section-label">Astronomy Lessons</span>
          <div class="section-rule"></div>
          <span class="section-link">New lessons weekly</span>
        </div>
        <div class="lessons-grid">
          <div class="lesson-card" v-for="lesson in lessons" :key="lesson.title" @click="startLesson(lesson)">
            <div class="lesson-icon">{{ lesson.icon }}</div>
            <div class="lesson-info">
              <div class="lesson-title">{{ lesson.title }}</div>
              <div class="lesson-desc">{{ lesson.desc }}</div>
            </div>
            <div class="lesson-tier" :class="lesson.tierClass">{{ lesson.tier }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-eyebrow-row">
          <span class="section-label">Your Saved Objects</span>
          <div class="section-rule"></div>
          <span class="section-link" @click="clearAllSaved">Clear all</span>
        </div>
        <div v-if="savedItems.length > 0" class="library-grid">
          <div v-for="(item, idx) in savedItems" :key="idx" class="library-item">
            <div class="library-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
            <div class="library-info"><div class="library-name">{{ item.name }}</div><div class="library-meta">{{ item.type }} • Saved {{ item.date }}</div></div>
            <div class="remove-btn" @click.stop="removeSavedItem(idx)">Remove</div>
          </div>
        </div>
        <div v-else class="empty-library"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom:1rem"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><p>Your library is empty</p><p style="font-size:0.8rem; margin-top:0.5rem">Browse threads and click "Save to Library" to collect your favorite objects.</p></div>
      </div>
    </div>
  `,
  data() {
    return {
      savedItems: [
        { name: "Orion Nebula (M42)", type: "Emission Nebula", date: "2 days ago" },
        { name: "Andromeda Galaxy (M31)", type: "Spiral Galaxy", date: "5 days ago" },
        { name: "Saturn Rings", type: "Planetary Feature", date: "1 week ago" },
        { name: "Pleiades (M45)", type: "Open Cluster", date: "2 weeks ago" }
      ],
      lessons: [
        { icon: "⭐", title: "Stars", desc: "Birth, life, and death of stars – from protostars to supernovae.", tier: "GOLD", tierClass: "tier-gold" },
        { icon: "🪐", title: "Planets", desc: "Our solar system's worlds and the hunt for exoplanets.", tier: "PLATINUM", tierClass: "tier-platinum" },
        { icon: "🌌", title: "Galaxies", desc: "Island universes: spirals, ellipticals, and the Milky Way.", tier: "DIAMOND", tierClass: "tier-diamond" },
        { icon: "☁️", title: "Nebulae", desc: "Cosmic clouds where stars and planets are forged.", tier: "PLATINUM", tierClass: "tier-platinum" },
        { icon: "🔭", title: "Cosmology", desc: "The origin, evolution, and fate of the universe.", tier: "DIAMOND", tierClass: "tier-diamond" },
        { icon: "🌙", title: "Observing", desc: "Tips for naked‑eye, binocular, and telescope astronomy.", tier: "GOLD", tierClass: "tier-gold" }
      ]
    };
  },
  methods: {
    removeSavedItem(index) { this.savedItems.splice(index, 1); },
    clearAllSaved() { this.savedItems = []; },
    startLesson(lesson) { alert(`Opening lesson: ${lesson.title}\n(Full course content would appear here.)`); }
  }
};
