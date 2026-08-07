const COURSE_BLUEPRINTS={
  stars:{
    title:'Stars',
    icon:'⭐',
    description:'Birth, life, and death of stars from protostars to stellar remnants.',
    sections:[
      {
        title:'Stellar Foundations',
        subtitle:'Learn what stars are, how they form, and how they spend most of their lives.',
        lessons:[
          ['What is a Star?','Learn what stars are made of and why they shine.','Sun star','Stars are enormous spheres of hot plasma held together by gravity.'],
          ['How Stars Form','Follow a star from a molecular cloud to the main sequence.','star formation protostar molecular cloud','Stars form when dense regions inside molecular clouds collapse under gravity.'],
          ['The Main Sequence','Explore the longest stage of a star’s life.','Sun main sequence star','Main-sequence stars generate energy by fusing hydrogen into helium.'],
          ['Color, Temperature and Mass','Discover why stars appear red, yellow, white, or blue.','blue red stars star cluster','A star’s color provides an important clue to its surface temperature.']
        ]
      },
      {
        title:'Stellar Evolution',
        subtitle:'Follow lower-mass and massive stars beyond the main sequence.',
        lessons:[
          ['Red Giants and Supergiants','Learn why aging stars expand dramatically.','red giant supergiant star','Stars expand after the hydrogen available for fusion in their cores becomes depleted.'],
          ['Planetary Nebulae','See how Sun-like stars release their outer layers.','planetary nebula Helix Ring Nebula','Lower-mass stars can eject their outer layers near the ends of their lives.'],
          ['White Dwarfs','Meet the dense remnants of Sun-like stars.','white dwarf star','White dwarfs are dense stellar remnants left by stars similar to the Sun.'],
          ['Massive Star Fusion','Discover how massive stars build heavier elements.','massive star fusion supergiant','Massive stars can progress through several stages of fusion involving increasingly heavy elements.'],
          ['Supernovae','Explore the explosive deaths of massive stars.','supernova remnant Cassiopeia Crab','Some massive stars end their lives in powerful core-collapse supernova explosions.']
        ]
      },
      {
        title:'Extreme Stellar Remnants',
        subtitle:'Explore neutron stars, pulsars, black holes, and interacting stars.',
        lessons:[
          ['Neutron Stars','Explore some of the densest objects in the universe.','neutron star NICER','Neutron stars are extraordinarily dense remnants produced by some massive-star supernovae.'],
          ['Pulsars and Magnetars','Meet rapidly spinning and highly magnetic neutron stars.','pulsar neutron star magnetar','Pulsars and magnetars are special types of neutron stars.'],
          ['Stellar-Mass Black Holes','Learn how the heaviest stellar cores can collapse even further.','stellar mass black hole','Some sufficiently massive stellar cores collapse into black holes.'],
          ['Binary Stars and Novae','Discover what happens when stars evolve with companions.','binary star nova white dwarf','Binary stars can exchange matter and produce phenomena such as novae.']
        ]
      },
      {
        title:'Understanding Stars',
        subtitle:'Learn how astronomers organize and study stellar populations.',
        lessons:[
          ['Star Clusters','Explore groups of stars that formed together.','open star cluster globular cluster','Star clusters provide valuable laboratories for studying stellar evolution.'],
          ['Spectral Classification','Learn how astronomers classify stars using their light.','stellar spectrum stars spectroscopy','Stellar spectra reveal temperature, composition, and other physical properties.'],
          ['The Hertzsprung-Russell Diagram','Learn how astronomers organize stars by luminosity and temperature.','Hertzsprung Russell diagram star cluster','The H-R diagram compares stellar luminosity with temperature or spectral class.']
        ]
      }
    ]
  },
  galaxies:{
    title:'Galaxies',
    icon:'🌌',
    description:'Explore galaxy structure, evolution, black holes, collisions, and the cosmic web.',
    sections:[
      {
        title:'Galaxy Foundations',
        subtitle:'Learn what galaxies are and how astronomers classify them.',
        lessons:[
          ['What is a Galaxy?','Learn what galaxies contain and how they are held together.','galaxy Hubble','Galaxies are gravitationally bound systems containing stars, gas, dust, dark matter, and stellar remnants.'],
          ['The Milky Way','Explore the structure of our home galaxy.','Milky Way galaxy center','The Milky Way is a barred spiral galaxy containing the Solar System.'],
          ['Types of Galaxies','Compare spiral, elliptical, and irregular galaxies.','spiral elliptical irregular galaxies','Galaxies are commonly classified as spiral, elliptical, or irregular systems.'],
          ['Inside a Galaxy','Meet the stars, gas, dust, and dark matter that make up galaxies.','galaxy dust gas stars','Galaxies contain multiple interacting components including stars, gas, dust, and dark matter.']
        ]
      },
      {
        title:'Galaxy Structure and Activity',
        subtitle:'Explore star formation, spiral structure, active nuclei, and dwarf galaxies.',
        lessons:[
          ['Star Formation in Galaxies','Learn why some galaxies form stars faster than others.','star forming galaxy Hubble','Cold molecular gas provides the raw material for new stars inside galaxies.'],
          ['Spiral Arms and Bars','Understand patterns seen in disk galaxies.','barred spiral galaxy','Spiral arms and bars are large-scale structures found in many disk galaxies.'],
          ['Elliptical Galaxies','Explore smooth galaxies dominated by older stars.','elliptical galaxy','Many elliptical galaxies contain older stellar populations and relatively little cold gas.'],
          ['Dwarf and Irregular Galaxies','Study small galaxies and systems with unusual shapes.','dwarf irregular galaxy','Dwarf galaxies are small but extremely common throughout the universe.'],
          ['Active Galaxies and Quasars','Learn how feeding black holes can outshine entire galaxies.','quasar active galactic nucleus','Active galactic nuclei are powered by matter falling toward supermassive black holes.']
        ]
      },
      {
        title:'Galaxy Evolution',
        subtitle:'See how galaxies grow, collide, and interact with their environments.',
        lessons:[
          ['Galaxy Collisions and Mergers','Learn what happens when galaxies interact.','interacting galaxies merger','Gravity can cause galaxies to interact, distort, and eventually merge.'],
          ['Supermassive Black Holes','Explore giant black holes in galactic centers.','supermassive black hole galaxy center','Most large galaxies appear to contain supermassive black holes in their centers.'],
          ['Dark Matter in Galaxies','See how invisible mass shapes galactic motion.','galaxy dark matter rotation curve','Galaxy motions provide strong evidence for large amounts of dark matter.'],
          ['The Local Group','Meet the Milky Way’s galactic neighborhood.','Local Group Andromeda Milky Way','The Milky Way belongs to a gravitationally bound collection of galaxies called the Local Group.']
        ]
      },
      {
        title:'The Galaxy Universe',
        subtitle:'Zoom out to clusters, deep fields, and cosmic evolution.',
        lessons:[
          ['Galaxy Clusters and the Cosmic Web','Explore enormous structures containing galaxies.','galaxy cluster cosmic web','Galaxies form groups, clusters, filaments, and voids across the cosmic web.'],
          ['Measuring Galaxy Distances','Learn how astronomers estimate enormous cosmic distances.','Cepheid supernova galaxy distance','Astronomers use several overlapping methods to construct a cosmic distance ladder.'],
          ['Deep Fields and Galaxy Evolution','See how Hubble and Webb look back through cosmic time.','Hubble Deep Field Webb galaxies','Deep observations reveal distant galaxies as they existed billions of years in the past.']
        ]
      }
    ]
  },
  cosmology:{
    title:'Cosmology',
    icon:'✳',
    description:'Study the origin, expansion, composition, structure, and fate of the universe.',
    sections:[
      {
        title:'Cosmology Foundations',
        subtitle:'Build a framework for thinking about the universe as a whole.',
        lessons:[
          ['What is Cosmology?','Learn what cosmologists study.','deep universe galaxies','Cosmology is the scientific study of the universe as a whole.'],
          ['The Scale of the Universe','Understand cosmic distances and large-scale structure.','deep field galaxies universe','The observable universe contains galaxies spread across enormous distances.'],
          ['An Expanding Universe','Learn what it means for space to expand.','expanding universe galaxies','Observations show that the universe is expanding on large scales.'],
          ['The Big Bang Model','Explore the hot, dense early universe.','early universe Big Bang','The Big Bang model describes an early universe that was much hotter and denser than today.']
        ]
      },
      {
        title:'The Early Universe',
        subtitle:'Explore the first atoms, background radiation, and growth of structure.',
        lessons:[
          ['The Cosmic Microwave Background','Meet the oldest light we can observe directly.','cosmic microwave background','The cosmic microwave background is relic radiation from the early universe.'],
          ['Big Bang Nucleosynthesis','Learn how the first light nuclei formed.','early universe nucleosynthesis','Hydrogen and helium nuclei formed during the universe’s first few minutes.'],
          ['From Atoms to the First Stars','Follow the universe from darkness to the first luminous objects.','first stars early universe Webb','The first stars formed after a long period known as the cosmic dark ages.'],
          ['Growth of Cosmic Structure','Learn how tiny density variations became galaxies and clusters.','cosmic web simulation galaxies','Gravity amplified small density differences into large cosmic structures.'],
          ['Dark Matter','Examine evidence for unseen gravitating matter.','dark matter galaxy cluster lensing','Dark matter is detected primarily through its gravitational influence.']
        ]
      },
      {
        title:'Modern Cosmology',
        subtitle:'Measure expansion, age, geometry, and dark energy.',
        lessons:[
          ['The Hubble-Lemaître Relation','Connect galaxy recession with cosmic distance.','Hubble galaxies redshift','More distant galaxies generally recede faster because of cosmic expansion.'],
          ['Redshift as a Cosmic Tool','Learn how stretched light reveals expansion and distance.','galaxy spectrum redshift','Cosmological expansion stretches traveling light toward longer wavelengths.'],
          ['Dark Energy','Explore evidence for accelerated cosmic expansion.','dark energy supernova universe','Dark energy is associated with the observed acceleration of cosmic expansion.'],
          ['The Age and Geometry of the Universe','Learn how cosmologists estimate cosmic age and curvature.','cosmic microwave background universe geometry','Modern observations indicate an age of roughly 13.8 billion years and nearly flat large-scale geometry.']
        ]
      },
      {
        title:'Cosmology Frontiers',
        subtitle:'Explore inflation, cosmic fate, and observations of the earliest eras.',
        lessons:[
          ['Cosmic Inflation','Learn about a proposed burst of extremely rapid early expansion.','early universe inflation CMB','Inflation proposes an extremely rapid expansion during a very early cosmic epoch.'],
          ['The Fate of the Universe','Explore possible long-term cosmic futures.','future universe galaxies','The long-term future of the universe depends strongly on the behavior of dark energy.'],
          ['Observing the Early Universe','See how modern telescopes probe cosmic dawn.','James Webb early galaxies','Infrared telescopes can detect highly redshifted galaxies from very early cosmic history.']
        ]
      }
    ]
  },
  planets:{
    title:'Planets',
    icon:'🪐',
    description:'Explore worlds in our Solar System and beyond.',
    sections:[
      {
        title:'Planetary Foundations',
        subtitle:'Learn what planets are and how the major classes differ.',
        lessons:[
          ['What is a Planet?','Learn the defining features of planets.','solar system planets','Planets are large bodies orbiting stars and shaped strongly by their own gravity.'],
          ['Terrestrial Planets','Compare Mercury, Venus, Earth, and Mars.','Mercury Venus Earth Mars','Mercury, Venus, Earth, and Mars are rocky terrestrial planets.'],
          ['Gas Giants and Ice Giants','Compare Jupiter, Saturn, Uranus, and Neptune.','Jupiter Saturn Uranus Neptune','Jupiter and Saturn are gas giants while Uranus and Neptune are ice giants.'],
          ['Dwarf Planets','Learn why Pluto belongs to a different category.','Pluto dwarf planet Ceres','Dwarf planets orbit the Sun and are rounded by gravity but have not cleared their orbital neighborhoods.']
        ]
      },
      {
        title:'Building Planetary Systems',
        subtitle:'Learn how planets form and what controls their environments.',
        lessons:[
          ['Protoplanetary Disks','See the disks where planets are born.','protoplanetary disk Webb ALMA','Planets form from gas and dust inside disks around young stars.'],
          ['How Planets Form','Follow material from dust to planets.','planet formation disk','Dust can grow into planetesimals, planetary embryos, and eventually planets through accretion.'],
          ['Planetary Atmospheres','Learn what controls an atmosphere’s composition and evolution.','planet atmosphere Mars Venus Earth','Planetary atmospheres evolve through gravity, chemistry, geology, impacts, and stellar radiation.'],
          ['Inside Planets','Explore cores, mantles, and internal heat.','planet interior Earth Mars Jupiter','Planetary interiors contain layered materials shaped by density, pressure, and heat.'],
          ['Planetary Magnetic Fields','Learn how planetary dynamos reveal interiors.','Earth Jupiter magnetic field aurora','Motion of electrically conducting material can generate planetary magnetic fields.']
        ]
      },
      {
        title:'Worlds of the Solar System',
        subtitle:'Explore the diversity of environments around our Sun.',
        lessons:[
          ['Mercury','Explore the smallest major planet and its extreme environment.','Mercury planet MESSENGER','Mercury is the closest major planet to the Sun and has a heavily cratered rocky surface.'],
          ['Venus','Study Earth’s hot, cloud-covered neighbor.','Venus planet Magellan','Venus has a dense carbon-dioxide atmosphere and an extreme greenhouse climate.'],
          ['Earth, Moon and Mars','Compare nearby rocky worlds and their histories.','Earth Moon Mars NASA','Earth, the Moon, and Mars preserve very different records of planetary evolution.'],
          ['Jupiter to Neptune','Tour the giant planets of the outer Solar System.','Jupiter Saturn Uranus Neptune Voyager','The giant planets have deep atmospheres, rings, powerful weather, and diverse moon systems.']
        ]
      },
      {
        title:'Exoplanets and Habitability',
        subtitle:'Explore planets around other stars and the search for habitable environments.',
        lessons:[
          ['Detecting Exoplanets','Learn how astronomers find planets around other stars.','exoplanet transit TESS','Astronomers detect exoplanets through methods including transits and radial velocity.'],
          ['Habitability','Learn what makes an environment potentially suitable for life.','habitable zone exoplanet','Habitability depends on water, atmosphere, chemistry, energy, stellar activity, and many other factors.'],
          ['Strange Exoplanets','Discover worlds unlike anything in our Solar System.','hot Jupiter super Earth exoplanet','Exoplanet surveys reveal hot Jupiters, super-Earths, mini-Neptunes, and many unusual systems.']
        ]
      }
    ]
  },
  nebulae:{
    title:'Nebulae',
    icon:'☁️',
    description:'Explore interstellar clouds, star-forming regions, and glowing stellar remnants.',
    sections:[
      {
        title:'Nebula Foundations',
        subtitle:'Learn what nebulae are and why they look different.',
        lessons:[
          ['What is a Nebula?','Learn what nebulae are made of.','nebula Hubble','Nebulae are enormous clouds of gas and dust in interstellar space.'],
          ['The Interstellar Medium','Explore the material between stars.','interstellar medium gas dust','The interstellar medium contains gas, dust, cosmic rays, and magnetic fields.'],
          ['Emission Nebulae','Learn why some nebulae glow brightly.','Orion Nebula emission nebula','Emission nebulae glow when energetic radiation ionizes surrounding gas.'],
          ['Reflection and Dark Nebulae','See how dust can scatter or block starlight.','reflection nebula dark nebula','Interstellar dust can scatter nearby starlight or block light from objects behind it.']
        ]
      },
      {
        title:'Stellar Nurseries',
        subtitle:'Learn how dense clouds fragment and create stars.',
        lessons:[
          ['Molecular Clouds','Explore the coldest star-forming material.','molecular cloud star formation','Cold molecular clouds are major sites of star formation.'],
          ['Protostars in Nebulae','See newborn stars still wrapped in dust.','protostar Webb nebula','Protostars form inside collapsing cloud cores and often remain hidden by dust.'],
          ['Pillars, Globules and Dense Cores','Explore structures inside giant clouds.','Pillars of Creation Eagle Nebula','Dense columns and globules are sculpted by gravity, radiation, winds, and magnetic fields.'],
          ['Jets and Herbig-Haro Objects','Learn how young stars create glowing shocks.','Herbig Haro jet Webb','Young stellar jets striking surrounding gas create glowing Herbig-Haro objects.'],
          ['Feedback from Massive Stars','See how hot stars reshape their birth clouds.','massive stars nebula bubbles','Massive stars reshape surrounding clouds through radiation, winds, and supernovae.']
        ]
      },
      {
        title:'Nebulae from Stellar Death',
        subtitle:'Explore planetary nebulae and supernova remnants.',
        lessons:[
          ['Planetary Nebulae','Study glowing shells around dying Sun-like stars.','planetary nebula Ring Helix','Planetary nebulae form from material expelled by evolved lower-mass stars.'],
          ['Supernova Remnants','Explore expanding debris from stellar explosions.','supernova remnant Crab Cassiopeia','Supernova remnants are expanding structures of shocked stellar debris and surrounding gas.'],
          ['The Crab Nebula','Meet one of the best-studied supernova remnants.','Crab Nebula Hubble Chandra','The Crab Nebula contains a pulsar left by a supernova observed in 1054.'],
          ['Element Recycling','Learn how nebulae enrich future stars and planets.','supernova element enrichment nebula','Stellar ejecta return elements to space that can later become part of new stars and planets.']
        ]
      },
      {
        title:'Reading Nebulae',
        subtitle:'Learn how astronomers interpret famous nebulae and multiwavelength data.',
        lessons:[
          ['Nebulae Across Wavelengths','See how different telescopes reveal different physics.','nebula infrared xray radio Hubble Webb','Visible, infrared, radio, ultraviolet, and X-ray observations reveal different nebular components.'],
          ['The Orion and Eagle Nebulae','Explore two famous stellar nurseries.','Orion Eagle Nebula Webb Hubble','The Orion and Eagle Nebulae contain active star-forming regions shaped by young massive stars.'],
          ['How Nebulae Change','Understand why nebulae are temporary structures.','nebula evolution expanding cloud','Nebulae continually collapse, fragment, expand, erode, and mix back into interstellar space.']
        ]
      }
    ]
  },
  observing:{
    title:'Observing',
    icon:'🔭',
    description:'Learn practical naked-eye, binocular, telescope, and imaging astronomy.',
    sections:[
      {
        title:'Observing Foundations',
        subtitle:'Learn to navigate the night sky and plan simple sessions.',
        lessons:[
          ['Reading the Night Sky','Learn how to orient yourself under the stars.','night sky stars Milky Way','Earth’s rotation and orbit control much of the apparent motion and seasonal change of the night sky.'],
          ['Constellations and Star Hopping','Use recognizable patterns to find targets.','constellations star chart','Constellations and bright stars can be used as reference points for locating fainter objects.'],
          ['Sky Coordinates','Learn altitude-azimuth and equatorial coordinates.','celestial sphere star chart','Astronomers use coordinate systems to specify precise locations in the sky.'],
          ['Dark Adaptation and Light Pollution','Protect your night vision and choose better observing sites.','dark sky Milky Way light pollution','Dark adaptation improves visual sensitivity while light pollution reduces contrast.']
        ]
      },
      {
        title:'Binoculars and Telescopes',
        subtitle:'Learn how optical equipment works and how to use it well.',
        lessons:[
          ['Using Binoculars','Turn simple binoculars into a powerful astronomy tool.','binocular astronomy Moon stars','Binoculars provide bright, wide-field views ideal for many astronomical objects.'],
          ['Telescope Basics','Understand aperture, focal length, and magnification.','telescope observatory','Aperture controls light-gathering power while focal length and eyepieces determine magnification.'],
          ['Refractors and Reflectors','Compare the main telescope optical designs.','refractor reflector telescope','Refractors use lenses while reflectors use mirrors to collect and focus light.'],
          ['Mounts and Tracking','Learn why a stable mount matters as much as the telescope.','equatorial telescope mount tracking','Telescope mounts provide stability and can track the apparent motion of the sky.'],
          ['Eyepieces and Filters','Use accessories effectively without expecting miracles.','telescope eyepiece Moon filter','Eyepieces control magnification and field of view while filters can enhance selected features.']
        ]
      },
      {
        title:'Observing Targets',
        subtitle:'Learn practical techniques for the Moon, planets, and deep-sky objects.',
        lessons:[
          ['Observing the Moon','Use changing illumination to reveal lunar terrain.','Moon telescope craters','Low-angle sunlight near the lunar terminator reveals craters, mountains, and other terrain.'],
          ['Observing the Planets','Learn what visual details to expect from major planets.','Jupiter Saturn Mars telescope','Planets require steady atmospheric conditions because their visible disks are relatively small.'],
          ['Star Clusters and Double Stars','Observe rewarding stellar targets.','Pleiades double star cluster','Clusters and double stars are accessible targets for binoculars and telescopes.'],
          ['Nebulae and Galaxies','Learn how to observe faint extended objects.','Andromeda Orion Nebula amateur observing','Dark skies, dark adaptation, and averted vision help reveal faint deep-sky objects.']
        ]
      },
      {
        title:'Observing Practice',
        subtitle:'Plan sessions, record observations, and begin astrophotography.',
        lessons:[
          ['Meteors and Comets','Observe transient visitors and meteor showers.','meteor shower comet night sky','Meteor showers and many bright comets are best enjoyed with wide-field observing.'],
          ['Planning and Observation Logs','Prepare efficient sessions and record what you see.','amateur astronomy observation notebook','Planning around weather, Moon phase, target altitude, and equipment improves observing sessions.'],
          ['Astrophotography Basics','Understand tracking, exposure, stacking, and calibration.','astrophotography telescope Milky Way','Astrophotography combines tracked exposures and image processing to reveal faint astronomical detail.']
        ]
      }
    ]
  }
};
const makeLesson=(categoryId,number,title,description,nasaSearch,fact,unlocked=false)=>{
  return{
    id:`${categoryId}-${number}`,
    type:'lesson',
    title,
    description,
    duration:number<=4?'6 min':'7 min',
    xp:number<=4?25:35,
    unlocked,
    completed:false,
    nasaSearch,
    content:{
      intro:description,
      sections:[
        {
          title:'Core Idea',
          text:fact
        },
        {
          title:'Why It Matters',
          text:`Understanding ${title.toLowerCase()} helps connect this topic to the wider study of ${COURSE_BLUEPRINTS[categoryId].title.toLowerCase()}.`
        },
        {
          title:'NASA Connection',
          text:`NASA missions, observatories, spacecraft, and scientific datasets help researchers investigate ${title.toLowerCase()} and related phenomena.`
        }
      ],
      activities:categoryId==='stars'&&number===2?[
        {
          id:'stars-2-order',
          type:'ordering',
          title:'Build a Star',
          question:'Put these stages of star formation in the correct order.',
          items:[
            'Molecular cloud',
            'Dense region collapses',
            'Protostar forms',
            'Core becomes hotter and denser',
            'Hydrogen fusion begins',
            'Main-sequence star'
          ],
          explanation:'Stars develop from collapsing molecular-cloud material into protostars before stable hydrogen fusion begins.'
        }
      ]:[],
      questions:[
        {
          id:`${categoryId}-${number}-q1`,
          type:'multiple-choice',
          question:`Which statement about ${title} is correct?`,
          answers:[
            fact,
            'It is unrelated to astronomy.',
            'It occurs only on Earth.',
            'It has no measurable physical effects.'
          ],
          correctAnswer:0,
          explanation:fact
        },
        {
          id:`${categoryId}-${number}-q2`,
          type:'true-false',
          question:`${title} is an important topic in astronomy.`,
          answers:['True','False'],
          correctAnswer:0,
          explanation:`${title} is part of the ${COURSE_BLUEPRINTS[categoryId].title} learning category.`
        }
      ],
      keyFacts:[
        fact,
        description,
        `NASA observations can be used to explore ${title.toLowerCase()}.`
      ]
    }
  };
};
const makeQuiz=(categoryId,index,title,lessons,isFinal=false)=>{
  const facts=lessons.flatMap(lesson=>lesson.content.keyFacts).filter((value,index,array)=>array.indexOf(value)===index).slice(0,isFinal?8:5);
  return{
    id:isFinal?`${categoryId}-final`:`${categoryId}-quiz-${index}`,
    type:'quiz',
    title,
    description:isFinal?`Complete the ${COURSE_BLUEPRINTS[categoryId].title} category.`:'Test what you learned in this section.',
    duration:isFinal?'10 min':'7 min',
    xp:isFinal?100:60,
    unlocked:false,
    completed:false,
    nasaSearch:`${COURSE_BLUEPRINTS[categoryId].title} NASA`,
    content:{
      intro:isFinal?'Review the complete category and finish the final challenge.':'Review the section before moving forward.',
      sections:[],
      activities:[],
      questions:facts.map((fact,i)=>({
        id:`${categoryId}-${isFinal?'final':`quiz-${index}`}-q${i+1}`,
        type:'multiple-choice',
        question:'Which statement is correct?',
        answers:[
          fact,
          'This statement is unrelated to the topic.',
          'This phenomenon occurs only on Earth.',
          'Scientists cannot observe this phenomenon.'
        ],
        correctAnswer:0,
        explanation:fact
      })),
      keyFacts:isFinal?[
        `${COURSE_BLUEPRINTS[categoryId].title} category complete.`,
        'You completed all four sections.'
      ]:[
        'Section complete.',
        'The next section can now be unlocked.'
      ]
    }
  };
};
const COURSE_DATA={};
Object.entries(COURSE_BLUEPRINTS).forEach(([categoryId,category])=>{
  let lessonNumber=1;
  const sections=[];
  category.sections.forEach((section,sectionIndex)=>{
    const sectionLessons=[];
    section.lessons.forEach(([title,description,nasaSearch,fact])=>{
      const unlocked=sectionIndex===0&&lessonNumber===1;
      sectionLessons.push(
        makeLesson(
          categoryId,
          lessonNumber,
          title,
          description,
          nasaSearch,
          fact,
          unlocked
        )
      );
      lessonNumber++;
    });
    const isFinal=sectionIndex===category.sections.length-1;
    const quizTitle=isFinal?`${category.title} Final Challenge`:`${section.title} Quiz`;
    sectionLessons.push(
      makeQuiz(
        categoryId,
        sectionIndex+1,
        quizTitle,
        sectionLessons,
        isFinal
      )
    );
    sections.push({
      id:`${categoryId}-section-${sectionIndex+1}`,
      title:`${sectionIndex+1}. ${section.title}`,
      subtitle:section.subtitle,
      lessons:sectionLessons
    });
  });
  COURSE_DATA[categoryId]={
    id:categoryId,
    title:category.title,
    icon:category.icon,
    description:category.description,
    rank:'BRONZE',
    level:1,
    sections
  };
});
