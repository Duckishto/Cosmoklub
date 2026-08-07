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

const DIFFICULTY_STAGES=[
  {name:'FOUNDATION',lessonQuestions:5,quizQuestions:10,duration:'15 min',quizDuration:'15 min'},
  {name:'INTERMEDIATE',lessonQuestions:6,quizQuestions:12,duration:'20 min',quizDuration:'18 min'},
  {name:'ADVANCED',lessonQuestions:7,quizQuestions:14,duration:'25 min',quizDuration:'22 min'},
  {name:'EXPERT',lessonQuestions:8,quizQuestions:20,duration:'30 min',quizDuration:'35 min'}
];

const LESSON_DEPTH={
  stars:[
    `A stable star exists in hydrostatic equilibrium: inward gravity is balanced by outward pressure generated by hot gas and radiation. In main-sequence stars, nuclear fusion in the core continually supplies the energy needed to maintain that pressure.`,
    `Star formation begins when part of a cold molecular cloud becomes gravitationally unstable. As the region contracts, gravitational potential energy becomes heat, a protostar forms, and angular momentum often produces a rotating disk before sustained hydrogen fusion begins.`,
    `A main-sequence star's mass strongly controls its core temperature, luminosity, fusion rate, and lifetime. High-mass stars have much larger fuel supplies but consume that fuel so rapidly that they live far shorter lives than low-mass stars.`,
    `Stellar color is related to surface temperature through thermal radiation: blue stars are generally hotter than red stars. Spectral absorption lines add information about ionization, composition, surface gravity, and temperature that color alone cannot provide.`,
    `When core hydrogen is exhausted, the helium-rich core contracts while hydrogen fusion continues in a surrounding shell. The increased energy output causes the outer envelope to expand and cool, producing a red giant or, for massive stars, a supergiant.`,
    `A planetary nebula forms when an evolved low- or intermediate-mass star sheds its outer layers. The exposed hot core emits ultraviolet radiation that ionizes the expanding gas, causing characteristic emission lines.`,
    `A white dwarf is supported mainly by electron degeneracy pressure rather than ordinary thermal pressure. It no longer sustains normal fusion and slowly cools; a non-rotating carbon-oxygen white dwarf cannot remain stable above roughly the Chandrasekhar mass.`,
    `Massive stars develop an onion-like sequence of fusion shells. Successively heavier nuclei are produced until an iron-group core forms; fusion beyond iron does not release net energy, so it cannot provide long-term pressure support.`,
    `In a core-collapse supernova, the collapsing stellar core forms a compact remnant while a shock and intense neutrino emission help eject the outer layers. The explosion disperses newly synthesized elements into the interstellar medium.`,
    `A neutron star packs roughly stellar mass into a sphere only tens of kilometers across. Its structure is supported by quantum effects and strong nuclear interactions; if the remnant is too massive, even this support can fail.`,
    `A pulsar is observed when a rotating neutron star's radiation beam sweeps across Earth. Magnetars are neutron stars with exceptionally strong magnetic fields, capable of powering energetic bursts and high-energy emission.`,
    `A stellar-mass black hole is identified indirectly through its gravitational effects, accretion emission, companion-star motion, or gravitational waves. The event horizon is a causal boundary, not a material surface.`,
    `In close binaries, Roche-lobe overflow can transfer gas from one star to another. Accretion onto a white dwarf can trigger a nova, while some binary configurations may eventually produce a Type Ia supernova.`,
    `Stars in a cluster are useful because they formed at roughly the same time and distance and often share similar initial composition. The main-sequence turnoff therefore reveals the cluster's age.`,
    `The O-B-A-F-G-K-M spectral sequence is primarily a temperature sequence. Absorption-line strengths depend not only on elemental abundance but also on excitation and ionization, so a weak line does not automatically mean an element is absent.`,
    `On a Hertzsprung-Russell diagram, luminosity is plotted against temperature or spectral class. Main-sequence stars form a diagonal band, while giants, supergiants, and white dwarfs occupy distinct regions because radius and temperature jointly determine luminosity.`
  ],
  galaxies:[
    `A galaxy is a gravitational system whose visible stars and gas occupy only part of its total mass. In most large galaxies, an extended dark-matter halo dominates the mass budget well beyond the bright stellar disk.`,
    `The Milky Way contains a thin and thick disk, a central bar and bulge, a stellar halo, gas, dust, globular clusters, and a dark-matter halo. The Solar System lies in the disk, far from the Galactic center.`,
    `Galaxy morphology describes structure rather than a fixed evolutionary ladder. Spirals, ellipticals, lenticulars, and irregulars differ in stellar populations, gas content, kinematics, and star-formation history.`,
    `Different galactic components trace different physical processes: cold gas is linked to star formation, dust absorbs and reradiates starlight, old stars preserve earlier history, and dark matter controls much of the gravitational potential.`,
    `Star formation correlates strongly with the availability and density of cold molecular gas. Feedback from young massive stars and supernovae can heat, ionize, compress, or expel gas, regulating future star formation.`,
    `Spiral arms are not usually permanent chains of the same stars. They can behave as long-lived or transient density patterns, while galactic bars redistribute angular momentum and can funnel gas toward central regions.`,
    `Many elliptical galaxies have little cold gas and old stellar populations, but their histories can include mergers and earlier starbursts. Their stars commonly move on more randomized orbits than stars in thin spiral disks.`,
    `Dwarf galaxies span many morphologies and are important tests of galaxy formation because they can be strongly influenced by feedback, tides, and dark matter. Their small visible mass does not imply simple dynamics.`,
    `An active galactic nucleus is powered by accretion onto a supermassive black hole. Friction and magnetic processes in the accretion flow convert gravitational energy into radiation, and some systems launch relativistic jets.`,
    `During a galaxy merger, direct star-star collisions are rare because stars are tiny compared with the space between them. Gas clouds, however, can collide and shock, while tides distort disks and can trigger bursts of star formation.`,
    `Supermassive black holes range from millions to billions of solar masses and correlate with properties of their host-galaxy bulges. Energy released during accretion can influence surrounding gas and potentially regulate galaxy growth.`,
    `Flat galaxy rotation curves imply that orbital speed remains unexpectedly high far from the luminous center. The simplest standard interpretation is an extended halo of unseen mass rather than mass following only the visible light.`,
    `The Local Group contains the Milky Way, Andromeda, Triangulum, and many dwarf galaxies. The Milky Way and Andromeda are gravitationally approaching one another even though the universe expands on much larger scales.`,
    `On the largest scales, galaxies trace a cosmic web of filaments, sheets, nodes, and voids. This structure grew from early density variations under gravity, with dark matter providing much of the gravitational framework.`,
    `The cosmic distance ladder combines methods with overlapping ranges. Parallax calibrates nearby standard candles such as Cepheids, which help calibrate more distant indicators including Type Ia supernovae.`,
    `Deep fields combine great sensitivity with lookback time: distant galaxies are seen as they existed in the past. Interpreting them requires accounting for redshift, selection effects, wavelength shifting, and evolving galaxy populations.`
  ],
  cosmology:[
    `Modern cosmology applies physical laws to the universe on the largest scales. The cosmological principle assumes that, when averaged over sufficiently large distances, the universe is approximately homogeneous and isotropic.`,
    `Cosmic distances are so large that light travel time becomes inseparable from observation: seeing a galaxy billions of light-years away means seeing it billions of years in the past. The observable universe is not necessarily the entire universe.`,
    `Cosmic expansion means that the scale of large-scale space changes with time. Gravitationally bound systems such as atoms, planetary systems, and galaxies do not simply stretch in proportion to the cosmic expansion.`,
    `The Big Bang model is not an explosion from one point into pre-existing empty space. It describes an early hot, dense state followed by expansion and cooling of the universe itself.`,
    `The cosmic microwave background was released when the universe cooled enough for electrons and nuclei to form neutral atoms, allowing photons to travel freely. Expansion has since redshifted that radiation to a nearly 2.7 K microwave background.`,
    `Big Bang nucleosynthesis occurred during the first few minutes, producing mostly hydrogen and helium nuclei with small amounts of deuterium, helium-3, and lithium. Heavier elements were produced much later inside stars and stellar explosions.`,
    `After recombination came the cosmic dark ages, before the first stars and galaxies supplied abundant visible and ultraviolet light. Radiation from early luminous objects later reionized much of the intergalactic hydrogen.`,
    `Tiny early density fluctuations grew through gravitational instability. Dark matter began clumping efficiently and provided gravitational wells into which ordinary matter fell, eventually producing galaxies, clusters, filaments, and voids.`,
    `Dark matter is inferred from multiple gravitational effects, including galaxy rotation, cluster dynamics, gravitational lensing, and the growth of cosmic structure. It does not need to emit visible light to be detected gravitationally.`,
    `At sufficiently low redshift, the Hubble-Lemaître relation approximates recession speed as proportional to distance. At large cosmological distances, a full relativistic expansion model is required rather than simply applying v=H0d.`,
    `Cosmological redshift can be expressed as z=(lambda_observed-lambda_emitted)/lambda_emitted. It reflects the stretching of photon wavelengths as the universe expands while the light travels.`,
    `Observations of distant Type Ia supernovae showed that the expansion history is inconsistent with a universe slowing only under matter's gravity. The standard model attributes the late-time acceleration to dark energy.`,
    `The universe's age, geometry, and composition are constrained jointly by observations such as the CMB, baryon acoustic oscillations, supernovae, and large-scale structure. Current measurements favor a universe close to spatially flat.`,
    `Inflation proposes a brief period of extraordinarily rapid early expansion. It helps explain the observed large-scale uniformity and near-flat geometry while providing a mechanism for generating primordial density fluctuations.`,
    `If dark energy behaves approximately like a cosmological constant, expansion continues indefinitely and distant regions become increasingly isolated, leading toward a cold, dilute future often called heat death.`,
    `Observing cosmic dawn depends strongly on infrared astronomy because expansion redshifts originally visible or ultraviolet radiation. Gravitational lensing can also magnify extremely distant galaxies and improve access to the early universe.`
  ],
  planets:[
    `A planet is shaped by self-gravity and orbits a star or stellar remnant, but classification also depends on dynamical context. In the Solar System, the IAU definition distinguishes planets from dwarf planets partly by whether they have cleared their orbital neighborhoods.`,
    `Terrestrial planets are dominated by rock and metal and have relatively high mean densities. Their differences in atmosphere, volcanism, water inventory, magnetic field, and impact history show that similar bulk composition can still produce very different worlds.`,
    `Jupiter and Saturn are dominated by hydrogen and helium, whereas Uranus and Neptune contain larger fractions of heavier volatile materials such as water, ammonia, and methane in their interiors. All four lack a simple solid surface like Earth's.`,
    `A dwarf planet is massive enough for self-gravity to make it nearly round but has not dynamically cleared its orbital neighborhood. This criterion concerns orbital dominance, not whether the body is geologically interesting.`,
    `Protoplanetary disks have strong temperature and composition gradients. The snow line influences where volatile compounds can condense, affecting the amount of solid material available for building planetary cores.`,
    `Planet formation proceeds through growth from dust to larger aggregates, planetesimals, embryos, and planets. Collisions, gravitational scattering, gas drag, and migration can rearrange a system long after the first solids appear.`,
    `Atmospheric retention depends on gravity, molecular speed, temperature, stellar radiation, magnetic environment, impacts, chemistry, and geological outgassing. A massive planet is not automatically guaranteed a permanent atmosphere.`,
    `Planetary differentiation separates materials by density when interiors become sufficiently hot and mobile. Long-term heat comes from accretion, differentiation, radioactive decay, tidal dissipation, and residual formation energy.`,
    `A planetary dynamo generally requires electrically conducting fluid, internal motion or convection, and suitable rotation. A large iron core alone does not guarantee a strong global magnetic field.`,
    `Mercury rotates in a 3:2 spin-orbit resonance rather than keeping one face permanently toward the Sun. Its large metallic core, weak global magnetic field, exosphere, and heavily cratered surface preserve clues to early Solar System history.`,
    `Venus's dense carbon-dioxide atmosphere produces an extreme greenhouse effect. Its slow retrograde rotation, global cloud cover, volcanic terrain, and lack of an Earth-like plate-tectonic system make it a key comparison for terrestrial climate evolution.`,
    `Earth, the Moon, and Mars record different levels of geological recycling. Earth's active surface erases much ancient terrain, the Moon preserves a long impact record, and Mars combines ancient cratered surfaces with evidence of past water and volcanism.`,
    `The outer giant planets host strong winds, complex magnetic fields, rings, and diverse moons. Their composition and internal heat influence atmospheric circulation, while moons such as Europa, Enceladus, and Titan broaden the search for habitable environments.`,
    `The transit method measures periodic decreases in stellar brightness, while radial velocity measures the star's line-of-sight motion caused by an orbiting planet. Each method has selection biases and provides different combinations of orbital and physical information.`,
    `The habitable zone describes where surface liquid water might be possible under suitable atmospheric conditions, but it is not a guarantee of habitability. Atmospheric composition, geology, stellar activity, magnetic environment, and water inventory also matter.`,
    `Hot Jupiters, super-Earths, mini-Neptunes, resonant chains, and highly eccentric planets demonstrate that planetary systems can undergo substantial migration and dynamical evolution. Solar System architecture is only one possible outcome.`
  ],
  nebulae:[
    `The word nebula covers physically different interstellar structures. A glowing H II region, a reflection nebula, a dark molecular cloud, a planetary nebula, and a supernova remnant can look cloud-like while having very different origins and energy sources.`,
    `The interstellar medium exists in multiple phases ranging from cold molecular gas to hot ionized plasma. Pressure balance, turbulence, magnetic fields, radiation, shocks, and gravity continually exchange material between these phases.`,
    `In an emission nebula, ultraviolet photons ionize atoms and later recombination and collisional excitation produce characteristic emission lines. The spectrum therefore carries information about temperature, density, composition, and ionization state.`,
    `Reflection nebulae are visible mainly because dust scatters starlight, often favoring shorter wavelengths. Dark nebulae appear dark because dust extinction blocks or reddens light from sources behind the cloud.`,
    `Molecular clouds are cold enough for molecules to survive and dense enough to shield their interiors from destructive ultraviolet radiation. Carbon monoxide is widely used as a tracer because cold molecular hydrogen is difficult to detect directly.`,
    `Protostars are powered largely by gravitational contraction and accretion before stable core hydrogen fusion begins. Dust surrounding them absorbs shorter-wavelength light and reradiates energy in the infrared.`,
    `Pillars, globules, and dense cores reflect competition between self-gravity and external effects such as ultraviolet radiation, stellar winds, turbulence, and magnetic fields. Some structures are eroded while dense pockets continue collapsing.`,
    `Herbig-Haro objects form where narrow jets from young stars collide with surrounding gas at high speed. Shock heating excites the gas, creating bright knots that can visibly change position over human timescales.`,
    `Massive-star feedback can both suppress and promote star formation. Radiation and winds can disperse molecular gas, but expanding shells can also compress neighboring material enough to encourage gravitational collapse.`,
    `Planetary nebulae are unrelated to planets. They are ionized shells ejected by evolved low- and intermediate-mass stars, illuminated by hot central remnants on their way toward the white-dwarf stage.`,
    `Supernova remnants contain fast shocks that heat gas to X-ray-emitting temperatures, accelerate particles that produce synchrotron radio emission, and mix stellar ejecta with the surrounding interstellar medium.`,
    `The Crab Nebula is powered strongly by a central pulsar and its relativistic particle wind. Much of the nebula's broadband glow is synchrotron radiation rather than ordinary thermal emission from warm gas.`,
    `Stellar evolution chemically enriches the interstellar medium. Winds, planetary nebulae, and supernovae return newly processed elements and dust that can later be incorporated into new stars, planets, and living systems.`,
    `Different wavelengths isolate different physical components: radio can trace cold molecules and synchrotron emission, infrared penetrates dust, optical light shows ionized gas, and X-rays reveal extremely hot plasma and energetic shocks.`,
    `The Orion Nebula and Eagle Nebula are both star-forming regions, but they are observed at different distances, scales, and evolutionary environments. Famous images combine morphology with spectroscopy and multiwavelength data to reveal their physics.`,
    `Nebulae are dynamic rather than permanent. Gravity, expansion, turbulence, shocks, stellar radiation, and galactic motion can collapse, fragment, ionize, disperse, or recycle a cloud over astronomical timescales.`
  ],
  observing:[
    `The sky's daily apparent rotation is caused mainly by Earth's rotation, while seasonal changes arise from Earth's orbit around the Sun. Which stars are circumpolar depends strongly on the observer's latitude.`,
    `Star hopping uses known bright stars and recognizable patterns as anchors, then moves through measured angular separations and fields of view. Successful hopping requires matching the chart orientation and scale to the actual view.`,
    `Altitude-azimuth coordinates are local and change with time as the sky moves. Right ascension and declination are tied to the celestial sphere and are better suited for catalogs and equatorial tracking.`,
    `Dark adaptation can take tens of minutes because the eye's rod system gradually becomes more sensitive. Bright white light can rapidly reduce that sensitivity, while dim red light usually preserves it better.`,
    `Binocular labels such as 10x50 indicate magnification and objective diameter. Aperture controls light collection, while the exit pupil equals objective diameter divided by magnification and affects how efficiently light reaches the eye.`,
    `Telescope aperture affects light gathering and diffraction-limited resolution, while magnification is set by telescope focal length divided by eyepiece focal length. Excessive magnification cannot recover detail that the optics or atmosphere do not resolve.`,
    `Refractors focus light with lenses and can suffer chromatic aberration unless corrected. Reflectors use mirrors, avoid ordinary chromatic aberration, but may require collimation and can have central obstructions depending on design.`,
    `Alt-azimuth mounts are mechanically simple, while equatorial mounts align an axis with Earth's rotation axis to simplify celestial tracking. Accurate long-exposure imaging additionally requires precise tracking and often guiding.`,
    `Eyepiece apparent field and magnification together determine approximate true field of view. Filters can improve contrast for selected targets or wavelengths, but they cannot create detail or photons that were never collected.`,
    `The lunar terminator often reveals topography better than the fully illuminated surface because low-angle sunlight casts long shadows. The best phase therefore depends on which lunar feature is being studied.`,
    `Planetary observing is often limited by atmospheric seeing rather than transparency. A very clear night can still have turbulent air that blurs fine planetary detail at high magnification.`,
    `Double stars test angular resolution and seeing, while open and globular clusters respond differently to aperture and field of view. A target's integrated magnitude alone does not describe how easy it will be to resolve visually.`,
    `Faint galaxies and nebulae often have low surface brightness. Dark skies, appropriate exit pupil, averted vision, patience, and shielding stray light can matter more than simply increasing magnification.`,
    `Meteor showers are best observed with a wide naked-eye field because meteors can appear far from the radiant. Comets may require binoculars or telescopes, and their appearance changes with distance, activity, and observing conditions.`,
    `Efficient observing plans consider target altitude, Moon phase and separation, twilight, weather, seeing, transparency, and equipment setup. A written log makes subtle changes and repeated observations scientifically more useful.`,
    `Long-exposure astrophotography requires accurate tracking because stars move across the detector as Earth rotates. Stacking improves signal-to-noise, while calibration frames help correct detector offsets, thermal signal, and optical illumination variations.`
  ]
};

const CATEGORY_EVIDENCE={
  stars:'Spectroscopy, photometry, light curves, astrometry, asteroseismology, and multiwavelength observations let astronomers infer stellar temperature, composition, luminosity, motion, radius, and internal behavior.',
  galaxies:'Imaging, spectroscopy, redshift, stellar and gas kinematics, gravitational lensing, and radio observations allow astronomers to reconstruct galaxy structure, mass, star formation, and evolution.',
  cosmology:'The CMB, supernova distances, redshift surveys, baryon acoustic oscillations, gravitational lensing, and large-scale structure provide independent constraints that must agree within a successful cosmological model.',
  planets:'Spacecraft measurements, spectroscopy, transit photometry, radial velocity, direct imaging, radar, and laboratory physics are combined to infer planetary composition, atmospheres, interiors, orbits, and histories.',
  nebulae:'Spectral lines and multiwavelength imaging are crucial because different temperatures and physical processes dominate in radio, infrared, optical, ultraviolet, and X-ray bands.',
  observing:'Reliable observing depends on separating properties of the target from limitations imposed by aperture, magnification, field of view, atmospheric seeing, transparency, light pollution, and detector performance.'
};

const CATEGORY_APPLICATION={
  stars:'The strongest stellar explanations connect mass, pressure, fusion, radiation, and evolution rather than treating each observed property independently.',
  galaxies:'Galaxy interpretation requires separating visible morphology from underlying mass, gas supply, kinematics, environment, and evolutionary history.',
  cosmology:'Cosmological conclusions are strongest when several independent observations support the same expansion history and matter-energy model.',
  planets:'Planetary comparisons work best when bulk properties, orbital context, atmosphere, internal heat, geology, and stellar environment are considered together.',
  nebulae:'Nebular appearance alone can be misleading; origin, excitation mechanism, temperature, density, composition, and wavelength must be considered together.',
  observing:'Good observing decisions match the instrument, magnification, field, site conditions, and technique to the angular size, brightness, and contrast of the target.'
};

const CATEGORY_FOUNDATIONS={
  stars:'Stellar astronomy is fundamentally a study of how gravity, pressure, nuclear physics, radiation, mass, and time interact. A star may appear as a point of light, but its observable spectrum and brightness contain information about an enormous physical system.',
  galaxies:'Galaxies must be studied across many scales at once. Individual stars and gas clouds create local structure, while gravity from billions of stars and a much larger dark-matter distribution governs the system as a whole.',
  cosmology:'Cosmology connects observations made today with physical conditions billions of years in the past. Because light has a finite speed, distant observations are also historical observations.',
  planets:'Planetary science compares worlds using mass, radius, density, composition, atmosphere, geology, orbit, thermal history, and interaction with the host star. Similar-looking worlds may have radically different physical histories.',
  nebulae:'Nebulae are not a single physical class. Their appearance depends on the material present, the source of energy, temperature, density, dust, ionization, and the wavelength used to observe them.',
  observing:'Practical astronomy combines celestial motion, optics, human vision, atmospheric effects, and careful planning. Better equipment helps, but technique and observing conditions often matter just as much.'
};

const CATEGORY_VARIABLES={
  stars:'When analyzing a star, pay attention to mass, radius, luminosity, surface temperature, core temperature, composition, age, rotation, magnetic activity, and evolutionary stage.',
  galaxies:'Important galactic variables include total mass, stellar mass, dark-matter distribution, gas fraction, star-formation rate, metallicity, morphology, velocity structure, environment, and redshift.',
  cosmology:'Cosmological interpretation frequently depends on redshift, distance, expansion rate, matter density, radiation density, dark-energy density, curvature, lookback time, and scale factor.',
  planets:'Key planetary variables include mass, radius, density, orbital distance, eccentricity, rotation, atmospheric pressure and composition, albedo, internal heat, and surface or cloud temperature.',
  nebulae:'Important nebular properties include gas density, temperature, ionization state, dust content, chemical abundance, velocity, magnetic field, radiation environment, and physical size.',
  observing:'Observing decisions depend on target magnitude, surface brightness, angular size, altitude, seeing, transparency, aperture, focal length, magnification, exit pupil, field of view, exposure time, and tracking accuracy.'
};

const CATEGORY_MISCONCEPTIONS={
  stars:'A brighter-looking star is not automatically more luminous. Apparent brightness depends on both intrinsic luminosity and distance. Likewise, red does not always mean old and blue does not always mean young without additional context.',
  galaxies:'A galaxy image does not show its complete mass distribution. Most of a galaxy’s inferred matter can be invisible, and a dramatic-looking merger does not mean most individual stars physically collide.',
  cosmology:'The Big Bang should not be imagined as matter exploding from one central point into surrounding empty space. Expansion occurs throughout space, and there is no known ordinary center of cosmic expansion.',
  planets:'Being inside the traditional habitable zone does not prove that a planet is habitable. Atmospheric pressure, composition, stellar activity, geology, water inventory, and many other factors matter.',
  nebulae:'The term planetary nebula is historical and misleading: planetary nebulae are produced by dying stars and are not clouds where planets are forming.',
  observing:'Higher magnification does not automatically create more detail. Once atmospheric seeing, diffraction, optical quality, or target brightness becomes limiting, additional magnification mainly enlarges blur.'
};

const CATEGORY_CONNECTIONS={
  stars:'Stellar evolution connects directly to galaxies and nebulae. Stars form from interstellar clouds, alter their surroundings with radiation and winds, synthesize elements, and later return enriched material to space.',
  galaxies:'Galaxies connect stellar evolution to cosmology. Their stars record local history, while their distribution and redshifts trace the growth and expansion of the universe.',
  cosmology:'Cosmology depends on astrophysics at smaller scales. Stars provide distance indicators, galaxies trace large-scale structure, and atomic physics explains spectral lines and the cosmic microwave background.',
  planets:'Planet formation is linked to star formation because both emerge from collapsing molecular-cloud material. Planetary atmospheres and habitability are also strongly influenced by stellar radiation and activity.',
  nebulae:'Nebulae connect the beginning and end of stellar evolution. Molecular clouds create stars, while stellar winds, planetary nebulae, and supernova remnants return material to the interstellar medium.',
  observing:'Observational astronomy connects all other categories. The physical knowledge of stars, planets, nebulae, and galaxies determines which wavelength, aperture, magnification, exposure, and observing strategy will reveal the desired information.'
};

const SPECIAL_QUESTIONS={
  'stars-3':{
    type:'multiple-choice',
    question:'Two main-sequence stars formed with similar composition. Star A is substantially more massive than Star B. Which combination is most likely?',
    answers:[
      'Star A has a hotter core, greater luminosity, faster fuel consumption, and a shorter main-sequence lifetime.',
      'Star A has a cooler core, lower luminosity, slower fuel consumption, and a longer main-sequence lifetime.',
      'Both stars must have equal luminosity because both fuse hydrogen.',
      'Star A cannot fuse hydrogen until it first becomes a red giant.'
    ],
    correctAnswer:0,
    explanation:'Greater stellar mass raises core pressure and temperature, causing a much higher fusion rate and luminosity. The fuel supply is larger, but it is consumed disproportionately faster, shortening the lifetime.'
  },
  'cosmology-10':{
    type:'multiple-choice',
    question:'Using the low-redshift approximation v=H0d with H0=70 km/s/Mpc, what recession speed is predicted for a galaxy 50 Mpc away?',
    answers:['3500 km/s','700 km/s','120 km/s','35,000 km/s'],
    correctAnswer:0,
    explanation:'v=H0d=(70 km/s/Mpc)(50 Mpc)=3500 km/s.'
  },
  'cosmology-11':{
    type:'multiple-choice',
    question:'A spectral line emitted at 500 nm is observed at 600 nm. Using z=(λobs-λemit)/λemit, what is the redshift?',
    answers:['0.20','0.50','1.20','100'],
    correctAnswer:0,
    explanation:'z=(600-500)/500=100/500=0.20.'
  },
  'planets-14':{
    type:'multiple-choice',
    question:'If a planet passes in front of its star and blocks 1% of the star’s light, what is approximately the planet-to-star radius ratio if limb darkening is ignored?',
    answers:['0.10','0.01','0.50','1.00'],
    correctAnswer:0,
    explanation:'Transit depth is approximately (Rp/Rs)^2. If the depth is 0.01, the radius ratio is √0.01=0.10.'
  },
  'observing-6':{
    type:'multiple-choice',
    question:'A telescope has a focal length of 1200 mm and uses a 10 mm eyepiece. What magnification does it produce?',
    answers:['120×','12×','1200×','10×'],
    correctAnswer:0,
    explanation:'Magnification=telescope focal length/eyepiece focal length=1200/10=120×.'
  },
  'observing-9':{
    type:'multiple-choice',
    question:'A 1000 mm focal-length telescope uses a 25 mm eyepiece. What magnification is produced?',
    answers:['40×','25×','100×','4×'],
    correctAnswer:0,
    explanation:'Magnification=1000/25=40×.'
  },
  'observing-16':{
    type:'multiple-choice',
    question:'If random noise dominates and 16 equal exposures are stacked, by approximately what factor can signal-to-noise improve compared with one exposure?',
    answers:['4×','16×','2×','256×'],
    correctAnswer:0,
    explanation:'For independent random noise, signal-to-noise improves approximately with the square root of the number of frames: √16=4.'
  }
};

const getBlueprintLessons=categoryId=>{
  return COURSE_BLUEPRINTS[categoryId].sections.flatMap(section=>section.lessons);
};

const rotateAnswers=(answers,correctIndex,shift)=>{
  const count=answers.length;
  const amount=((shift%count)+count)%count;
  const rotated=answers.slice(amount).concat(answers.slice(0,amount));
  const correctAnswer=(correctIndex-amount+count)%count;
  return{answers:rotated,correctAnswer};
};

const uniqueOptions=(correct,candidates)=>{
  const values=[correct,...candidates.filter(value=>value&&value!==correct)];
  return[...new Set(values)].slice(0,4);
};

const getDistractorFacts=(categoryId,number)=>{
  const lessons=getBlueprintLessons(categoryId);
  const indexes=[number+2,number+5,number+9].map(value=>(value-1)%lessons.length);
  return indexes.map(index=>lessons[index][3]);
};

const getDistractorDepth=(categoryId,number)=>{
  const depths=LESSON_DEPTH[categoryId];
  const indexes=[number+3,number+7,number+11].map(value=>(value-1)%depths.length);
  return indexes.map(index=>depths[index]);
};

const makeQuestion=(id,type,question,answers,correctAnswer,explanation,seed=0)=>{
  if(type==='true-false'){
    return{id,type,question,answers,correctAnswer,explanation};
  }
  const rotated=rotateAnswers(answers,correctAnswer,seed);
  return{
    id,
    type,
    question,
    answers:rotated.answers,
    correctAnswer:rotated.correctAnswer,
    explanation
  };
};

const makeLessonQuestions=(categoryId,number,title,fact,depth,sectionIndex)=>{
  const difficulty=DIFFICULTY_STAGES[sectionIndex];
  const factDistractors=getDistractorFacts(categoryId,number);
  const depthDistractors=getDistractorDepth(categoryId,number);
  const questions=[];

  questions.push(
    makeQuestion(
      `${categoryId}-${number}-q1`,
      'multiple-choice',
      `Which statement is most specifically associated with ${title}?`,
      uniqueOptions(fact,factDistractors),
      0,
      fact,
      number
    )
  );

  questions.push(
    makeQuestion(
      `${categoryId}-${number}-q2`,
      'multiple-choice',
      `Which explanation best captures the deeper physics or reasoning behind ${title}?`,
      uniqueOptions(depth,depthDistractors),
      0,
      depth,
      number+1
    )
  );

  const falseStatement=depthDistractors[0];
  const useFalse=number%2===1;

  questions.push({
    id:`${categoryId}-${number}-q3`,
    type:'true-false',
    question:useFalse
      ?`True or false: the following statement correctly describes ${title}: "${falseStatement}"`
      :`True or false: the following statement correctly describes ${title}: "${depth}"`,
    answers:['True','False'],
    correctAnswer:useFalse?1:0,
    explanation:useFalse
      ?`That statement describes a different concept in ${COURSE_BLUEPRINTS[categoryId].title}. For ${title}, the relevant explanation is: ${depth}`
      :depth
  });

  questions.push(
    makeQuestion(
      `${categoryId}-${number}-q4`,
      'multiple-choice',
      `An astronomer wants to distinguish ${title} from other topics in this category. Which finding would be the strongest conceptual match?`,
      uniqueOptions(depth,[factDistractors[1],depthDistractors[1],factDistractors[2]]),
      0,
      `The strongest match is the statement that directly describes the mechanism or defining behavior of ${title}. ${depth}`,
      number+2
    )
  );

  questions.push(
    makeQuestion(
      `${categoryId}-${number}-q5`,
      'multiple-choice',
      `Which conclusion is best supported by what you learned about ${title}?`,
      uniqueOptions(
        `${fact} ${CATEGORY_APPLICATION[categoryId]}`,
        [
          `The topic can be understood from appearance alone without considering its physical mechanism.`,
          `A single observation is always sufficient to determine every important property of the system.`,
          `The same explanation can be applied unchanged to every object in the ${COURSE_BLUEPRINTS[categoryId].title.toLowerCase()} category.`
        ]
      ),
      0,
      `${fact} ${CATEGORY_APPLICATION[categoryId]}`,
      number+3
    )
  );

  if(difficulty.lessonQuestions>=6){
    questions.push(
      makeQuestion(
        `${categoryId}-${number}-q6`,
        'multiple-choice',
        `Which research strategy would produce the most defensible interpretation of ${title}?`,
        [
          `Combine multiple observations with a physical model, then check whether the model explains the defining behavior of ${title}.`,
          `Use only the object's visible color and ignore all other measurements.`,
          `Assume the first plausible explanation is correct without testing alternatives.`,
          `Treat every object in the category as physically identical.`
        ],
        0,
        `${CATEGORY_EVIDENCE[categoryId]} Multiple independent constraints reduce the chance of confusing correlation with physical cause.`,
        number+4
      )
    );
  }

  if(difficulty.lessonQuestions>=7){
    questions.push(
      makeQuestion(
        `${categoryId}-${number}-q7`,
        'multiple-choice',
        `Which comparison is most scientifically useful when evaluating ${title}?`,
        uniqueOptions(
          `Compare the observed properties with the mechanism described here: ${depth}`,
          [
            `Compare only the names assigned to the objects and ignore measured properties.`,
            `Assume two objects with similar images must have identical origins.`,
            `Ignore scale, environment, and wavelength because they do not affect interpretation.`
          ]
        ),
        0,
        `Advanced interpretation requires connecting observations to mechanism, not merely matching visual appearance. ${depth}`,
        number+5
      )
    );
  }

  if(difficulty.lessonQuestions>=8){
    questions.push(
      makeQuestion(
        `${categoryId}-${number}-q8`,
        'multiple-choice',
        `A new observation appears inconsistent with the simplest explanation of ${title}. What is the best scientific response?`,
        [
          `Check measurement uncertainty, test alternative models, and determine whether the new evidence requires the physical interpretation to be revised.`,
          `Discard the new observation because the existing explanation must be correct.`,
          `Change the answer without checking whether the observation is reliable.`,
          `Assume the disagreement proves that no physical model can describe the phenomenon.`
        ],
        0,
        `Scientific models are evaluated against evidence. An apparent conflict should trigger checks of data quality, assumptions, and competing explanations.`,
        number+6
      )
    );
  }

  const special=SPECIAL_QUESTIONS[`${categoryId}-${number}`];

  if(special){
    const slot=Math.min(questions.length-1,Math.max(4,difficulty.lessonQuestions-1));
    questions[slot]={
      id:`${categoryId}-${number}-q${slot+1}`,
      ...special
    };
  }

  return questions.slice(0,difficulty.lessonQuestions);
};

const makeActivities=(categoryId,number)=>{
  const activities=[];

  if(categoryId==='stars'&&number===2){
    activities.push({
      id:'stars-2-order',
      type:'ordering',
      title:'Build a Star',
      question:'Put these stages of star formation in the correct physical order.',
      items:[
        'Cold molecular cloud',
        'Dense region becomes gravitationally unstable',
        'Collapse increases density and temperature',
        'Protostar and rotating disk form',
        'Core becomes hot enough for sustained hydrogen fusion',
        'Main-sequence hydrostatic equilibrium is established'
      ],
      explanation:'Gravity drives the initial collapse. A protostar forms before core hydrogen fusion becomes self-sustaining; the onset of stable fusion marks arrival on the main sequence.'
    });
  }

  if(categoryId==='cosmology'&&number===4){
    activities.push({
      id:'cosmology-4-order',
      type:'ordering',
      title:'Early-Universe Sequence',
      question:'Arrange these broad cosmic stages from earliest to latest.',
      items:[
        'Hot, dense early universe',
        'Big Bang nucleosynthesis',
        'Recombination and CMB release',
        'Cosmic dark ages',
        'First stars and galaxies',
        'Large-scale structure continues growing'
      ],
      explanation:'As expansion cooled the universe, nucleosynthesis occurred first, neutral atoms formed later at recombination, then the dark ages ended as the first luminous structures appeared.'
    });
  }

  if(categoryId==='planets'&&number===6){
    activities.push({
      id:'planets-6-order',
      type:'ordering',
      title:'Build a Planet',
      question:'Arrange the simplified stages of rocky-planet growth.',
      items:[
        'Microscopic dust grains in a disk',
        'Larger aggregates',
        'Planetesimals',
        'Planetary embryos',
        'Giant impacts and accretion',
        'Mature differentiated planet'
      ],
      explanation:'Planet formation is not perfectly linear, but growth generally proceeds from small solids to gravitationally interacting planetesimals and embryos before final assembly.'
    });
  }

  if(categoryId==='observing'&&number===16){
    activities.push({
      id:'observing-16-order',
      type:'ordering',
      title:'Astrophotography Workflow',
      question:'Put this simplified imaging workflow in a sensible order.',
      items:[
        'Plan target and framing',
        'Polar align or prepare tracking',
        'Capture light frames',
        'Capture appropriate calibration frames',
        'Calibrate and register images',
        'Stack and process the result'
      ],
      explanation:'Good processing cannot replace poor acquisition. Planning, tracking, calibration, registration, stacking, and controlled processing form one connected workflow.'
    });
  }

  return activities;
};

const buildTeachingSections=(categoryId,number,title,description,fact,depth,sectionIndex,nasaSearch)=>{
  const difficulty=DIFFICULTY_STAGES[sectionIndex];
  const categoryTitle=COURSE_BLUEPRINTS[categoryId].title;

  const sections=[
    {
      title:'1. Big Picture',
      text:`${description} Before focusing on the details, place ${title.toLowerCase()} inside the broader subject of ${categoryTitle.toLowerCase()}. ${CATEGORY_FOUNDATIONS[categoryId]}`
    },
    {
      title:'2. Core Idea',
      text:fact
    },
    {
      title:'3. Physical Mechanism',
      text:depth
    },
    {
      title:'4. Important Variables',
      text:`When reasoning about ${title.toLowerCase()}, avoid thinking in terms of only one visible property. ${CATEGORY_VARIABLES[categoryId]} Which of these variables matters most depends on the specific object and observation.`
    },
    {
      title:'5. Evidence and Measurement',
      text:`Astronomers do not identify ${title.toLowerCase()} from definitions alone. ${CATEGORY_EVIDENCE[categoryId]} Measurements are compared with physical models to determine which interpretation is most consistent with the evidence.`
    },
    {
      title:'6. Cause and Effect',
      text:`Ask what causes the behavior instead of memorizing only what happens. For ${title.toLowerCase()}, connect the observed result to the physical mechanism described earlier. ${CATEGORY_APPLICATION[categoryId]}`
    },
    {
      title:'7. Common Misconception',
      text:`A useful way to strengthen understanding is to identify an explanation that sounds reasonable but is incomplete or wrong. ${CATEGORY_MISCONCEPTIONS[categoryId]} Keep this distinction in mind when you reach the practice questions, because several distractors may contain statements that are partly true but irrelevant to the question.`
    }
  ];

  if(sectionIndex>=1){
    sections.push({
      title:'8. Compare and Contrast',
      text:`At the ${difficulty.name.toLowerCase()} level, compare ${title.toLowerCase()} with nearby concepts rather than treating it in isolation. Ask which observations are shared, which mechanisms differ, and what measurement would allow an astronomer to distinguish between competing explanations.`
    });
  }

  if(sectionIndex>=1){
    sections.push({
      title:'9. Scientific Reasoning',
      text:`Suppose two observations appear to support different explanations of ${title.toLowerCase()}. The correct response is not to choose whichever observation looks more convincing. First check uncertainty, selection effects, wavelength, distance, geometry, assumptions, and whether both observations can be explained by a single physical model.`
    });
  }

  if(sectionIndex>=2){
    sections.push({
      title:'10. Connection to Other Topics',
      text:`${CATEGORY_CONNECTIONS[categoryId]} Understanding ${title.toLowerCase()} therefore improves your ability to reason about topics outside this individual lesson.`
    });
  }

  if(sectionIndex>=2){
    sections.push({
      title:'11. Advanced Interpretation',
      text:`Advanced astronomy rarely asks only "what is this?" A stronger question is "what combination of evidence would make this interpretation more likely than an alternative?" For ${title.toLowerCase()}, combine the core fact — ${fact} — with the deeper mechanism and observational evidence rather than relying on a single clue.`
    });
  }

  if(sectionIndex>=3){
    sections.push({
      title:'12. Model Limitations',
      text:`Scientific models simplify reality. When applying a model to ${title.toLowerCase()}, identify its assumptions and the range where it is valid. A useful approximation can still become inaccurate when conditions, scales, velocities, densities, wavelengths, or environments move outside the range for which the approximation was designed.`
    });
  }

  if(sectionIndex>=3){
    sections.push({
      title:'13. Expert Reasoning',
      text:`At expert level, separate observation from interpretation. First state what was actually measured. Then identify the physical inference. Finally ask what alternative process could produce a similar signal and what additional observation would discriminate between the possibilities.`
    });
  }

  sections.push({
    title:'Practice Preparation',
    text:`Before moving into the questions, make sure you can explain ${title.toLowerCase()} without simply repeating its definition. You should be able to describe the mechanism, identify important variables, connect the concept to observations, recognize a common misconception, and explain why an alternative answer could be wrong.`
  });

  sections.push({
    title:'NASA Connection',
    text:`NASA missions, observatories, spacecraft, and scientific archives provide observations related to ${title.toLowerCase()}. The lesson searches NASA's image archive using the topic "${nasaSearch}", giving you a real observational example before the practice section.`
  });

  return sections;
};

const makeLesson=(
  categoryId,
  number,
  title,
  description,
  nasaSearch,
  fact,
  sectionIndex,
  unlocked=false
)=>{
  const difficulty=DIFFICULTY_STAGES[sectionIndex];
  const depth=LESSON_DEPTH[categoryId][number-1]||fact;

  return{
    id:`${categoryId}-${number}`,
    type:'lesson',
    title,
    description,
    difficulty:difficulty.name,
    duration:difficulty.duration,
    xp:number<=4?25:35,
    unlocked,
    completed:false,
    nasaSearch,
    content:{
      intro:`${description} This ${difficulty.name.toLowerCase()} lesson teaches the concept in depth before the practice section begins.`,
      sections:buildTeachingSections(
        categoryId,
        number,
        title,
        description,
        fact,
        depth,
        sectionIndex,
        nasaSearch
      ),
      activities:makeActivities(categoryId,number),
      questions:makeLessonQuestions(
        categoryId,
        number,
        title,
        fact,
        depth,
        sectionIndex
      ),
      keyFacts:[
        fact,
        depth,
        CATEGORY_APPLICATION[categoryId],
        CATEGORY_CONNECTIONS[categoryId],
        `Difficulty: ${difficulty.name}.`
      ]
    }
  };
};

const cloneQuestionForQuiz=(question,id)=>{
  return{
    id,
    type:question.type,
    question:question.question,
    answers:[...question.answers],
    correctAnswer:question.correctAnswer,
    explanation:question.explanation
  };
};

const buildQuizQuestions=(categoryId,index,sourceLessons,isFinal)=>{
  const target=isFinal
    ?20
    :DIFFICULTY_STAGES[index-1].quizQuestions;

  const pool=[];

  sourceLessons.forEach(lesson=>{
    const questions=lesson.content.questions;
    if(!questions.length)return;

    if(isFinal){
      const hardStart=Math.max(0,questions.length-3);
      questions.slice(hardStart).forEach(question=>pool.push(question));
    }else{
      const start=Math.min(Math.max(1,index),questions.length-1);
      const ordered=questions.slice(start).concat(questions.slice(0,start));
      ordered.forEach(question=>pool.push(question));
    }
  });

  const selected=[];
  const used=new Set();
  let cursor=0;

  while(selected.length<target&&cursor<pool.length*3){
    const position=(cursor*5+index*3)%pool.length;
    const question=pool[position];
    const signature=`${question.question}|${question.answers.join('|')}`;

    if(!used.has(signature)){
      used.add(signature);
      selected.push(question);
    }

    cursor++;
  }

  if(selected.length<target){
    for(const question of pool){
      const signature=`${question.question}|${question.answers.join('|')}`;

      if(!used.has(signature)){
        used.add(signature);
        selected.push(question);

        if(selected.length>=target){
          break;
        }
      }
    }
  }

  return selected
    .slice(0,target)
    .map((question,i)=>
      cloneQuestionForQuiz(
        question,
        `${categoryId}-${isFinal?'final':`quiz-${index}`}-q${i+1}`
      )
    );
};

const makeQuiz=(
  categoryId,
  index,
  title,
  sourceLessons,
  isFinal=false
)=>{
  const difficulty=isFinal
    ?DIFFICULTY_STAGES[3]
    :DIFFICULTY_STAGES[index-1];

  const questions=buildQuizQuestions(
    categoryId,
    index,
    sourceLessons,
    isFinal
  );

  return{
    id:isFinal
      ?`${categoryId}-final`
      :`${categoryId}-quiz-${index}`,
    type:'quiz',
    title,
    description:isFinal
      ?`Complete a cumulative ${COURSE_BLUEPRINTS[categoryId].title} challenge covering the entire category.`
      :`Test your understanding of this section with ${questions.length} increasingly demanding questions.`,
    difficulty:isFinal?'FINAL CHALLENGE':difficulty.name,
    duration:isFinal?'35 min':difficulty.quizDuration,
    xp:isFinal?100:60,
    unlocked:false,
    completed:false,
    nasaSearch:`${COURSE_BLUEPRINTS[categoryId].title} NASA`,
    content:{
      intro:isFinal
        ?`This final challenge samples concepts from all four sections. Expect application, comparison, interpretation, and quantitative reasoning where appropriate.`
        :`This ${difficulty.name.toLowerCase()} quiz tests more than recall. Read each option carefully because incorrect choices may be scientifically true statements that belong to a different concept.`,
      sections:isFinal
        ?[
          {
            title:'Final Review: Core Principles',
            text:`Review the major physical relationships from the complete ${COURSE_BLUEPRINTS[categoryId].title} category before attempting the final challenge. Focus on cause and effect instead of isolated definitions.`
          },
          {
            title:'Final Review: Evidence',
            text:CATEGORY_EVIDENCE[categoryId]
          },
          {
            title:'Final Review: Connections',
            text:CATEGORY_CONNECTIONS[categoryId]
          },
          {
            title:'Final Challenge Strategy',
            text:'Use relationships between concepts, eliminate answers that are true but irrelevant, check units in numerical questions, and prefer explanations that are consistent with multiple observations.'
          }
        ]
        :[
          {
            title:'Section Review',
            text:`Before beginning the quiz, mentally connect the lessons in this section. Identify which ideas describe observations, which describe underlying mechanisms, and which variables determine the outcome.`
          },
          {
            title:'Evidence Review',
            text:CATEGORY_EVIDENCE[categoryId]
          },
          {
            title:'Quiz Strategy',
            text:'Do not choose an answer merely because it sounds scientific. Identify exactly what the question asks, then connect the observation to the relevant physical mechanism.'
          }
        ],
      activities:[],
      questions,
      keyFacts:isFinal
        ?[
          `${COURSE_BLUEPRINTS[categoryId].title} category complete after this challenge.`,
          `The final contains ${questions.length} cumulative questions.`,
          'The strongest answers connect observations, mechanisms, and evidence rather than relying on isolated memorized phrases.'
        ]
        :[
          'Section complete after this quiz.',
          `This quiz contains ${questions.length} questions.`,
          'The next section unlocks after the current section is completed.'
        ]
    }
  };
};

const COURSE_DATA={};

Object.entries(COURSE_BLUEPRINTS).forEach(([categoryId,category])=>{
  let lessonNumber=1;
  const sections=[];
  const allCategoryLessons=[];

  category.sections.forEach((section,sectionIndex)=>{
    const sectionLessons=[];

    section.lessons.forEach(([title,description,nasaSearch,fact])=>{
      const unlocked=sectionIndex===0&&lessonNumber===1;

      const lesson=makeLesson(
        categoryId,
        lessonNumber,
        title,
        description,
        nasaSearch,
        fact,
        sectionIndex,
        unlocked
      );

      sectionLessons.push(lesson);
      allCategoryLessons.push(lesson);
      lessonNumber++;
    });

    const isFinal=sectionIndex===category.sections.length-1;

    const quizTitle=isFinal
      ?`${category.title} Final Challenge`
      :`${section.title} Quiz`;

    const quizSource=isFinal
      ?allCategoryLessons
      :sectionLessons;

    sectionLessons.push(
      makeQuiz(
        categoryId,
        sectionIndex+1,
        quizTitle,
        quizSource,
        isFinal
      )
    );

    sections.push({
      id:`${categoryId}-section-${sectionIndex+1}`,
      title:`${sectionIndex+1}. ${section.title}`,
      subtitle:section.subtitle,
      difficulty:isFinal
        ?'EXPERT / FINAL'
        :DIFFICULTY_STAGES[sectionIndex].name,
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
