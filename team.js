// CosmoKlub — Our Team page logic.
// Mirrors the lightweight nav/starfield/lang setup used on object.html.

const { createApp } = Vue;

createApp({
  data() {
    return {
      mobileMenuOpen: false,
      langOpen: false,
      navScrolled: false,
      navCompact: false,
      currentLang: window.CosmoKlub.LANGS[0],
      langs: window.CosmoKlub.LANGS,

      // ── Team roster ──────────────────────────────────────────────────
      // Every card on the page (Project Lead, Developer Team, Research
      // Team) is generated from these three arrays — nothing about a
      // person is hardcoded in team.html. To add, remove, or edit someone,
      // just edit the objects below:
      //   name  → shown as the card title
      //   role  → shown as the small uppercase label under the name
      //   img   → path to their photo (see note below)
      //   bio   → optional one-line description; leave '' to hide it
      //
      // Photos: put image files in the /team folder (same level as this
      // file, i.e. Cosmoklub-main/team/) and name them 1.png, 2.png, 3.png…
      // in the same order as the entries below (currently 1–7, one file
      // per person across all three teams combined). To update someone's
      // headshot, just overwrite their numbered file in /team — no code
      // change needed. To add a new person, add an entry with the next
      // free number, e.g. img: 'team/8.png', and drop team/8.png in.
      projectLead: [
        { name: 'Kittikawin Sawanglab', role: 'Project Lead', img: 'team/1.png', bio: '' },
      ],
      developerTeam: [
        { name: 'Kritsadaphas Sangthong', role: 'Developer', img: 'team/2.png', bio: '' },
        { name: 'Siraphop Larbninjinda', role: 'Developer', img: 'team/3.png', bio: '' },
        { name: 'Weerawit Watjanarat', role: 'Creative', img: 'team/4.png', bio: '' },
      ],
      researchTeam: [
        { name: 'Pattanan naosaran', role: 'Researcher', img: 'team/5.png', bio: '' },
        { name: 'Watcharaphon Pisutwatthanasakul', role: 'Researcher', img: 'team/6.png', bio: '' },
        { name: 'Name Surname', role: 'Researcher', img: 'team/7.png', bio: '' },
      ],
    };
  },

  mounted() {
    window.CosmoKlub.initStarfield();
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      this.navScrolled = y > 20;
      this.navCompact = y > 80;
    }, { passive: true });
    document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) this.langOpen = false; });
  },

  methods: {
    setLang(l) { this.currentLang = l; this.langOpen = false; },
  },
}).mount('#team-app');
