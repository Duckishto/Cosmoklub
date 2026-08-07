const COURSE_DATA = {
  stars: {
    id: 'stars',
    title: 'Stars',
    icon: '⭐',
    description: 'Birth, life, and death of stars from protostars to supernovae.',
    rank: 'BRONZE',
    level: 1,

    sections: [
      {
        id: 'stars-foundations',
        title: 'Stellar Foundations',
        subtitle: 'Learn what stars are and how they are born.',

        lessons: [
          {
            id: 'stars-1',
            type: 'lesson',
            title: 'What is a Star?',
            description: 'Learn what stars are made of and what makes them shine.',
            duration: '5 min',
            xp: 25,
            unlocked: true,
            completed: false
          },

          {
            id: 'stars-2',
            type: 'lesson',
            title: 'How Stars Form',
            description: 'Discover how enormous clouds of gas collapse into newborn stars.',
            duration: '7 min',
            xp: 30,
            unlocked: false,
            completed: false
          },

          {
            id: 'stars-quiz-1',
            type: 'quiz',
            title: 'Stellar Foundations Quiz',
            description: 'Test your understanding of stars and stellar formation.',
            duration: '5 min',
            xp: 50,
            unlocked: false,
            completed: false
          },

          {
            id: 'stars-3',
            type: 'lesson',
            title: 'The Main Sequence',
            description: 'Learn about the longest stage in the life of a star.',
            duration: '8 min',
            xp: 35,
            unlocked: false,
            completed: false
          },

          {
            id: 'stars-4',
            type: 'lesson',
            title: 'Red Giants',
            description: 'Discover what happens when stars begin running out of hydrogen.',
            duration: '7 min',
            xp: 35,
            unlocked: false,
            completed: false
          }
        ]
      }
    ]
  },

  galaxies: {
    id: 'galaxies',
    title: 'Galaxies',
    icon: '🌌',
    description: 'Island universes: spirals, ellipticals, and the Milky Way.',
    rank: 'BRONZE',
    level: 1,

    sections: [
      {
        id: 'galaxies-foundations',
        title: 'Galaxy Foundations',
        subtitle: 'Explore the enormous structures of the universe.',

        lessons: [
          {
            id: 'galaxies-1',
            type: 'lesson',
            title: 'What is a Galaxy?',
            description: 'Learn what galaxies contain and how large they can become.',
            duration: '5 min',
            xp: 25,
            unlocked: true,
            completed: false
          },

          {
            id: 'galaxies-2',
            type: 'lesson',
            title: 'Types of Galaxies',
            description: 'Explore spiral, elliptical, and irregular galaxies.',
            duration: '7 min',
            xp: 30,
            unlocked: false,
            completed: false
          },

          {
            id: 'galaxies-quiz-1',
            type: 'quiz',
            title: 'Galaxy Foundations Quiz',
            description: 'Test your knowledge of galaxy types.',
            duration: '5 min',
            xp: 50,
            unlocked: false,
            completed: false
          }
        ]
      }
    ]
  },

  cosmology: {
    id: 'cosmology',
    title: 'Cosmology',
    icon: '✳',
    description: 'The origin, evolution, and fate of the universe.',
    rank: 'BRONZE',
    level: 1,

    sections: [
      {
        id: 'cosmology-foundations',
        title: 'Cosmology Foundations',
        subtitle: 'Begin exploring the universe as a whole.',

        lessons: [
          {
            id: 'cosmology-1',
            type: 'lesson',
            title: 'What is Cosmology?',
            description: 'Learn what cosmologists study.',
            duration: '5 min',
            xp: 25,
            unlocked: true,
            completed: false
          },

          {
            id: 'cosmology-2',
            type: 'lesson',
            title: 'The Big Bang',
            description: 'Explore the early history of the universe.',
            duration: '8 min',
            xp: 35,
            unlocked: false,
            completed: false
          },

          {
            id: 'cosmology-quiz-1',
            type: 'quiz',
            title: 'Cosmology Foundations Quiz',
            description: 'Test your understanding of basic cosmology.',
            duration: '5 min',
            xp: 50,
            unlocked: false,
            completed: false
          }
        ]
      }
    ]
  },

  planets: {
    id: 'planets',
    title: 'Planets',
    icon: '🪐',
    description: "Our solar system's worlds and the hunt for exoplanets.",
    rank: 'BRONZE',
    level: 1,

    sections: [
      {
        id: 'planets-foundations',
        title: 'Planetary Foundations',
        subtitle: 'Learn how planets form and how they differ.',

        lessons: [
          {
            id: 'planets-1',
            type: 'lesson',
            title: 'What is a Planet?',
            description: 'Learn the basic characteristics of planets.',
            duration: '5 min',
            xp: 25,
            unlocked: true,
            completed: false
          },

          {
            id: 'planets-2',
            type: 'lesson',
            title: 'Terrestrial Planets',
            description: 'Explore Mercury, Venus, Earth, and Mars.',
            duration: '7 min',
            xp: 30,
            unlocked: false,
            completed: false
          },

          {
            id: 'planets-quiz-1',
            type: 'quiz',
            title: 'Planet Foundations Quiz',
            description: 'Test your understanding of planets.',
            duration: '5 min',
            xp: 50,
            unlocked: false,
            completed: false
          }
        ]
      }
    ]
  },

  nebulae: {
    id: 'nebulae',
    title: 'Nebulae',
    icon: '☁️',
    description: 'Cosmic clouds where stars and planets are forged.',
    rank: 'BRONZE',
    level: 1,

    sections: [
      {
        id: 'nebulae-foundations',
        title: 'Nebula Foundations',
        subtitle: 'Explore enormous clouds of gas and dust.',

        lessons: [
          {
            id: 'nebulae-1',
            type: 'lesson',
            title: 'What is a Nebula?',
            description: 'Learn what nebulae are made of.',
            duration: '5 min',
            xp: 25,
            unlocked: true,
            completed: false
          },

          {
            id: 'nebulae-2',
            type: 'lesson',
            title: 'Emission Nebulae',
            description: 'Discover why some nebulae glow.',
            duration: '7 min',
            xp: 30,
            unlocked: false,
            completed: false
          },

          {
            id: 'nebulae-quiz-1',
            type: 'quiz',
            title: 'Nebula Foundations Quiz',
            description: 'Test your understanding of nebulae.',
            duration: '5 min',
            xp: 50,
            unlocked: false,
            completed: false
          }
        ]
      }
    ]
  },

  observing: {
    id: 'observing',
    title: 'Observing',
    icon: '🔭',
    description: 'Tips for naked-eye, binocular, and telescope astronomy.',
    rank: 'BRONZE',
    level: 1,

    sections: [
      {
        id: 'observing-foundations',
        title: 'Observing Foundations',
        subtitle: 'Learn how to explore the night sky.',

        lessons: [
          {
            id: 'observing-1',
            type: 'lesson',
            title: 'Reading the Night Sky',
            description: 'Learn how to orient yourself under the stars.',
            duration: '5 min',
            xp: 25,
            unlocked: true,
            completed: false
          },

          {
            id: 'observing-2',
            type: 'lesson',
            title: 'Using Binoculars',
            description: 'Learn how binoculars can reveal more of the night sky.',
            duration: '6 min',
            xp: 30,
            unlocked: false,
            completed: false
          },

          {
            id: 'observing-quiz-1',
            type: 'quiz',
            title: 'Observing Foundations Quiz',
            description: 'Test your basic observing knowledge.',
            duration: '5 min',
            xp: 50,
            unlocked: false,
            completed: false
          }
        ]
      }
    ]
  }
};
