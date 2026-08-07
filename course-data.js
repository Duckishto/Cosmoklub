const COURSE_DATA={
  stars:{
    id:'stars',
    title:'Stars',
    icon:'⭐',
    description:'Birth, life, and death of stars from protostars to stellar remnants.',
    rank:'BRONZE',
    level:1,
    sections:[
      {
        id:'stars-foundations',
        title:'1. Stellar Foundations',
        subtitle:'Learn what stars are, how they form, and how they spend most of their lives.',
        lessons:[
          {
            id:'stars-1',
            type:'lesson',
            title:'What is a Star?',
            description:'Learn what stars are made of and why they shine.',
            duration:'5 min',
            xp:25,
            unlocked:true,
            completed:false,
            nasaSearch:'Sun star',
            content:{
              intro:'Stars are enormous objects made mostly of hydrogen and helium. Their gravity holds them together while energy produced inside them pushes outward.',
              sections:[
                {title:'Held Together by Gravity',text:'A star contains an enormous amount of mass. Its gravity continually pulls its material inward, while pressure from the hot interior pushes outward.'},
                {title:'What Stars Are Made Of',text:'Most stars contain mostly hydrogen and helium, with smaller amounts of heavier elements. Much of their material exists as plasma because of their extreme temperatures.'},
                {title:'Why Stars Shine',text:'During the main sequence, nuclear fusion combines hydrogen nuclei into helium in the core. This process releases energy that eventually escapes from the star as radiation.'}
              ],
              questions:[
                {id:'stars-1-q1',type:'multiple-choice',question:'What element makes up most of a typical star?',answers:['Iron','Hydrogen','Carbon','Oxygen'],correctAnswer:1,explanation:'Hydrogen is the most abundant element in most stars.'},
                {id:'stars-1-q2',type:'true-false',question:'The Sun is a star.',answers:['True','False'],correctAnswer:0,explanation:'The Sun is the star at the center of our solar system.'},
                {id:'stars-1-q3',type:'multiple-choice',question:'What powers a main-sequence star?',answers:['Chemical fire','Nuclear fusion','Planetary motion','Radioactivity alone'],correctAnswer:1,explanation:'Nuclear fusion in the core releases the energy that powers a main-sequence star.'}
              ],
              keyFacts:['Stars are made mainly of hydrogen and helium.','Gravity pulls inward while pressure pushes outward.','The Sun is a star.','Main-sequence stars are powered by nuclear fusion.']
            }
          },
          {
            id:'stars-2',
            type:'lesson',
            title:'How Stars Form',
            description:'Follow a star from a molecular cloud to the main sequence.',
            duration:'7 min',
            xp:30,
            unlocked:false,
            completed:false,
            nasaSearch:'star formation protostar molecular cloud',
            content:{
              intro:'Stars are born inside cold molecular clouds containing gas and dust. Gravity can cause dense regions of these clouds to collapse and form protostars.',
              sections:[
                {title:'Stellar Nurseries',text:'Cold molecular clouds contain dense pockets of gas and dust. As a dense region collects more material, its gravity becomes stronger.'},
                {title:'The Protostar',text:'Gravity causes the dense region to contract. The center becomes hotter and denser, producing a developing object called a protostar.'},
                {title:'Fusion Ignites',text:'If the protostar becomes hot and dense enough, hydrogen fusion begins in its core. The object then enters the main sequence.'}
              ],
              activities:[
                {id:'stars-2-order',type:'ordering',title:'Build a Star',question:'Put these stages in the correct order.',items:['Molecular cloud','Dense region collapses','Protostar forms','Core heats and compresses','Hydrogen fusion begins','Main-sequence star'],explanation:'A star develops from a collapsing region of a molecular cloud into a protostar, then reaches the main sequence after hydrogen fusion begins.'}
              ],
              questions:[
                {id:'stars-2-q1',type:'multiple-choice',question:'Where are stars born?',answers:['Molecular clouds','Inside planets','Black-hole event horizons','Asteroid belts'],correctAnswer:0,explanation:'Stars form in molecular clouds of cold gas and dust.'},
                {id:'stars-2-q2',type:'multiple-choice',question:'What is a protostar?',answers:['A dead star','A forming star before stable hydrogen fusion','A small planet','A neutron star'],correctAnswer:1,explanation:'A protostar is a developing star whose core has not yet established stable hydrogen fusion.'},
                {id:'stars-2-q3',type:'true-false',question:'Stable hydrogen fusion marks the beginning of the main sequence.',answers:['True','False'],correctAnswer:0,explanation:'A star reaches the main sequence once stable hydrogen fusion begins in its core.'}
              ],
              keyFacts:['Molecular clouds are stellar nurseries.','Gravity drives the initial collapse.','A protostar forms before the main sequence.','Hydrogen fusion marks the beginning of the main sequence.']
            }
          },
          {
            id:'stars-3',
            type:'lesson',
            title:'The Main Sequence',
            description:'Explore the longest stage of a star’s life.',
            duration:'7 min',
            xp:30,
            unlocked:false,
            completed:false,
            nasaSearch:'Sun main sequence star',
            content:{
              intro:'A star spends most of its life on the main sequence, steadily fusing hydrogen into helium in its core.',
              sections:[
                {title:'A Long Stable Stage',text:'Main-sequence stars maintain a long-lasting balance between inward gravity and outward pressure produced by their hot interiors.'},
                {title:'Hydrogen to Helium',text:'Hydrogen fusion in the core produces helium and releases energy. This supplies the star with heat and radiation.'},
                {title:'Mass Matters',text:'A star’s mass strongly affects its temperature, brightness, fuel consumption, lifetime, and eventual fate.'}
              ],
              questions:[
                {id:'stars-3-q1',type:'multiple-choice',question:'What is being fused in the core of a main-sequence star?',answers:['Hydrogen into helium','Iron into hydrogen','Carbon into hydrogen','Helium into oxygen only'],correctAnswer:0,explanation:'Main-sequence stars primarily fuse hydrogen into helium.'},
                {id:'stars-3-q2',type:'true-false',question:'The Sun is currently a main-sequence star.',answers:['True','False'],correctAnswer:0,explanation:'The Sun is currently in its main-sequence stage.'}
              ],
              keyFacts:['The main sequence is the longest stage for most stars.','Hydrogen fusion powers this stage.','Gravity and internal pressure remain approximately balanced.','Mass strongly influences a star’s life.']
            }
          },
          {
            id:'stars-4',
            type:'lesson',
            title:'Color, Temperature and Mass',
            description:'Discover why stars appear red, yellow, white, or blue.',
            duration:'6 min',
            xp:30,
            unlocked:false,
            completed:false,
            nasaSearch:'blue red stars star cluster',
            content:{
              intro:'Stars have different colors, temperatures, sizes, and masses. Their color provides an important clue to their surface temperature.',
              sections:[
                {title:'Color Reveals Temperature',text:'Hotter stars tend to appear blue or blue-white, while cooler stars appear orange or red. The Sun lies between these extremes.'},
                {title:'Mass Controls Evolution',text:'High-mass stars generally have hotter cores and consume nuclear fuel rapidly. Lower-mass stars consume their fuel much more slowly.'},
                {title:'Brightness',text:'A star’s luminosity depends on properties including its temperature and size. Two stars with similar colors can still have very different luminosities.'}
              ],
              questions:[
                {id:'stars-4-q1',type:'multiple-choice',question:'Which color generally indicates the hottest stellar surface?',answers:['Red','Orange','Blue','Brown'],correctAnswer:2,explanation:'Blue stars generally have hotter surfaces than red or orange stars.'},
                {id:'stars-4-q2',type:'true-false',question:'High-mass stars generally use their nuclear fuel faster than low-mass stars.',answers:['True','False'],correctAnswer:0,explanation:'Their hotter cores drive much faster fusion rates.'}
              ],
              keyFacts:['Blue stars are generally hotter than red stars.','Mass affects stellar lifetime.','Massive stars burn fuel rapidly.','Brightness depends on more than color alone.']
            }
          },
          {
            id:'stars-quiz-1',
            type:'quiz',
            title:'Stellar Foundations Quiz',
            description:'Test what you learned about stars, formation, and the main sequence.',
            duration:'6 min',
            xp:50,
            unlocked:false,
            completed:false,
            nasaSearch:'stars Milky Way',
            content:{
              intro:'Complete this checkpoint before moving into stellar evolution.',
              sections:[],
              questions:[
                {id:'stars-quiz-1-q1',type:'multiple-choice',question:'What starts the collapse of a dense region inside a molecular cloud?',answers:['Magnetism alone','Gravity','Sunlight','Planet formation'],correctAnswer:1,explanation:'Gravity causes sufficiently dense regions to contract.'},
                {id:'stars-quiz-1-q2',type:'multiple-choice',question:'What comes immediately before a main-sequence star?',answers:['White dwarf','Protostar','Neutron star','Red giant'],correctAnswer:1,explanation:'A protostar develops into a main-sequence star when stable hydrogen fusion begins.'},
                {id:'stars-quiz-1-q3',type:'multiple-choice',question:'Main-sequence stars primarily fuse:',answers:['Hydrogen','Iron','Uranium','Silicon'],correctAnswer:0,explanation:'Hydrogen is fused into helium during the main sequence.'},
                {id:'stars-quiz-1-q4',type:'multiple-choice',question:'Which star would normally have the hottest surface?',answers:['Red star','Orange star','Blue star','All colors indicate identical temperatures'],correctAnswer:2,explanation:'Blue stars generally have hotter surfaces.'},
                {id:'stars-quiz-1-q5',type:'true-false',question:'A star’s mass affects its evolution.',answers:['True','False'],correctAnswer:0,explanation:'Mass is one of the most important factors controlling stellar evolution.'}
              ],
              keyFacts:['You completed Stellar Foundations.','Next: learn how stars change after the main sequence.']
            }
          }
        ]
      },
      {
        id:'stars-evolution',
        title:'2. Stellar Evolution',
        subtitle:'Follow low-mass and massive stars beyond the main sequence.',
        lessons:[
          {
            id:'stars-5',
            type:'lesson',
            title:'Red Giants and Supergiants',
            description:'Learn why aging stars expand dramatically.',
            duration:'7 min',
            xp:35,
            unlocked:false,
            completed:false,
            nasaSearch:'red giant supergiant star',
            content:{
              intro:'When a star exhausts the hydrogen available for fusion in its core, its internal structure changes dramatically.',
              sections:[
                {title:'Leaving the Main Sequence',text:'As core hydrogen becomes depleted, the core contracts and heats. Hydrogen fusion can continue in a shell surrounding the core.'},
                {title:'The Star Expands',text:'Changes in the core and fusion shells cause the outer layers to expand and cool. Lower-mass stars become giants, while very massive stars can become supergiants.'},
                {title:'Different Futures',text:'The later evolution of a star depends strongly on its mass. Sun-like stars and massive stars eventually follow very different paths.'}
              ],
              questions:[
                {id:'stars-5-q1',type:'multiple-choice',question:'Why does a star leave the main sequence?',answers:['Its planets disappear','Core hydrogen becomes depleted','Gravity stops existing','Its surface freezes'],correctAnswer:1,explanation:'The main-sequence stage ends when the core can no longer sustain the same hydrogen-fusion process.'},
                {id:'stars-5-q2',type:'true-false',question:'The Sun is expected eventually to become a red giant.',answers:['True','False'],correctAnswer:0,explanation:'The Sun will eventually leave the main sequence and expand into a red giant.'}
              ],
              keyFacts:['Core hydrogen depletion ends the main sequence.','The core contracts while outer layers expand.','Sun-like stars become red giants.','Massive stars can become supergiants.']
            }
          },
          {
            id:'stars-6',
            type:'lesson',
            title:'Planetary Nebulae',
            description:'See how Sun-like stars release their outer layers.',
            duration:'6 min',
            xp:35,
            unlocked:false,
            completed:false,
            nasaSearch:'planetary nebula Helix Ring Nebula',
            content:{
              intro:'Near the end of a Sun-like star’s life, its outer layers can be expelled into space, producing a glowing structure called a planetary nebula.',
              sections:[
                {title:'Outer Layers Escape',text:'An evolved low- or intermediate-mass star can lose its outer atmosphere. The expanding material forms shells of gas around the exposed hot core.'},
                {title:'A Misleading Name',text:'Planetary nebulae have nothing to do with planets. The historical name came from their planet-like appearance through early telescopes.'},
                {title:'Recycling Matter',text:'The expelled gas contains material that can later become part of new clouds, stars, planets, and other astronomical objects.'}
              ],
              questions:[
                {id:'stars-6-q1',type:'multiple-choice',question:'What is a planetary nebula?',answers:['A cloud created from expelled layers of an evolved star','A planet covered in gas','A star-forming galaxy','A black-hole disk'],correctAnswer:0,explanation:'Planetary nebulae consist of material expelled by evolved lower-mass stars.'},
                {id:'stars-6-q2',type:'true-false',question:'Planetary nebulae are actually planets.',answers:['True','False'],correctAnswer:1,explanation:'Despite their name, they are shells of gas produced by evolved stars.'}
              ],
              keyFacts:['Planetary nebulae are not planets.','They form from expelled stellar material.','The hot stellar core remains behind.','Ejected material helps enrich interstellar space.']
            }
          },
          {
            id:'stars-7',
            type:'lesson',
            title:'White Dwarfs',
            description:'Meet the dense remnants of Sun-like stars.',
            duration:'7 min',
            xp:35,
            unlocked:false,
            completed:false,
            nasaSearch:'white dwarf star',
            content:{
              intro:'After a Sun-like star sheds its outer layers, its exposed core remains as an extremely dense object called a white dwarf.',
              sections:[
                {title:'A Stellar Remnant',text:'A white dwarf is no longer carrying out normal core fusion. It shines primarily because it is initially extremely hot.'},
                {title:'Small but Dense',text:'A typical white dwarf is roughly comparable to Earth in size while containing a substantial fraction of a star’s mass.'},
                {title:'Cooling Slowly',text:'Without ongoing core fusion, a white dwarf gradually radiates away stored heat and cools over extremely long timescales.'}
              ],
              questions:[
                {id:'stars-7-q1',type:'multiple-choice',question:'A white dwarf is best described as:',answers:['A young protostar','The dense remnant of a lower-mass star','A planet','A galaxy'],correctAnswer:1,explanation:'White dwarfs are remnants left after stars like the Sun lose their outer layers.'},
                {id:'stars-7-q2',type:'true-false',question:'White dwarfs normally sustain hydrogen fusion in their cores like main-sequence stars.',answers:['True','False'],correctAnswer:1,explanation:'A white dwarf is a stellar remnant without normal main-sequence core fusion.'}
              ],
              keyFacts:['White dwarfs are stellar remnants.','They are extremely dense.','They are roughly Earth-sized.','They gradually cool over time.']
            }
          },
          {
            id:'stars-8',
            type:'lesson',
            title:'Massive Star Fusion',
            description:'Discover how massive stars build heavier elements.',
            duration:'8 min',
            xp:40,
            unlocked:false,
            completed:false,
            nasaSearch:'massive star fusion supergiant',
            content:{
              intro:'Massive stars can continue through additional fusion stages after core hydrogen and helium are exhausted.',
              sections:[
                {title:'Successive Fuels',text:'As each fuel is exhausted, the core contracts and becomes hotter. Massive stars can then fuse progressively heavier nuclei.'},
                {title:'Building Toward Iron',text:'Very massive stars can eventually produce elements through stages involving carbon, neon, oxygen, and silicon, building an iron-rich core.'},
                {title:'The Iron Problem',text:'Fusing iron into still heavier elements does not provide the energy needed to support the star. Once an iron core grows beyond what can be supported, collapse can follow.'}
              ],
              questions:[
                {id:'stars-8-q1',type:'multiple-choice',question:'Which element marks an important endpoint of energy-producing fusion in massive stellar cores?',answers:['Hydrogen','Iron','Lithium','Helium'],correctAnswer:1,explanation:'Fusion beyond iron does not provide the same energy support to the stellar core.'},
                {id:'stars-8-q2',type:'true-false',question:'Massive stars can undergo more fusion stages than Sun-like stars.',answers:['True','False'],correctAnswer:0,explanation:'Their hotter cores allow successive fusion stages involving heavier elements.'}
              ],
              keyFacts:['Massive stars undergo multiple fusion stages.','Their cores become hotter after each fuel is depleted.','Iron eventually accumulates in the core.','An iron core cannot continue supporting the star through ordinary energy-releasing fusion.']
            }
          },
          {
            id:'stars-9',
            type:'lesson',
            title:'Supernovae',
            description:'Explore the explosive deaths of massive stars.',
            duration:'8 min',
            xp:40,
            unlocked:false,
            completed:false,
            nasaSearch:'supernova remnant Cassiopeia Crab',
            content:{
              intro:'When the core of a massive star can no longer support itself against gravity, it can collapse catastrophically and produce a supernova.',
              sections:[
                {title:'Core Collapse',text:'Once the core loses sufficient pressure support, gravity drives a rapid collapse. The central material becomes extraordinarily dense.'},
                {title:'The Explosion',text:'The collapse can launch an enormous explosion that ejects much of the star into space at tremendous speed.'},
                {title:'Cosmic Recycling',text:'Supernova ejecta distribute newly created and previously existing elements into surrounding space, enriching material that can later participate in new star and planet formation.'}
              ],
              questions:[
                {id:'stars-9-q1',type:'multiple-choice',question:'What happens immediately before a core-collapse supernova?',answers:['The stellar core collapses','The star becomes a planet','All gravity disappears','The star enters the main sequence'],correctAnswer:0,explanation:'The core collapses when it can no longer support itself against gravity.'},
                {id:'stars-9-q2',type:'true-false',question:'Supernovae can return stellar material to interstellar space.',answers:['True','False'],correctAnswer:0,explanation:'The explosion ejects material that can enrich future molecular clouds.'}
              ],
              keyFacts:['Massive-star cores can collapse catastrophically.','The explosion ejects stellar material.','Supernovae help enrich interstellar space.','A compact remnant may survive.']
            }
          },
          {
            id:'stars-quiz-2',
            type:'quiz',
            title:'Stellar Evolution Quiz',
            description:'Test your understanding of how stars age and die.',
            duration:'7 min',
            xp:60,
            unlocked:false,
            completed:false,
            nasaSearch:'stellar evolution',
            content:{
              intro:'Check your understanding of red giants, white dwarfs, massive stars, and supernovae.',
              sections:[],
              questions:[
                {id:'stars-quiz-2-q1',type:'multiple-choice',question:'What will the Sun eventually become after its red-giant phase?',answers:['White dwarf','Neutron star','Stellar-mass black hole','Blue supergiant'],correctAnswer:0,explanation:'The Sun is expected eventually to leave behind a white dwarf.'},
                {id:'stars-quiz-2-q2',type:'multiple-choice',question:'Planetary nebulae come from:',answers:['Expelled outer layers of evolved lower-mass stars','Colliding planets','Black-hole jets','Young protostars'],correctAnswer:0,explanation:'They are produced when evolved stars shed their outer material.'},
                {id:'stars-quiz-2-q3',type:'multiple-choice',question:'What happens when a massive star develops an unsupported core?',answers:['Core collapse can occur','It becomes a planet','Fusion becomes unlimited','Gravity reverses'],correctAnswer:0,explanation:'Loss of sufficient core support allows gravity to drive collapse.'},
                {id:'stars-quiz-2-q4',type:'true-false',question:'A white dwarf is normally produced by a star like the Sun.',answers:['True','False'],correctAnswer:0,explanation:'Sun-like stars can end as white dwarfs.'},
                {id:'stars-quiz-2-q5',type:'true-false',question:'A core-collapse supernova can leave behind a compact remnant.',answers:['True','False'],correctAnswer:0,explanation:'Depending on the remaining core, a neutron star or black hole can form.'}
              ],
              keyFacts:['You completed Stellar Evolution.','Next: explore the extreme remnants left after stellar death.']
            }
          }
        ]
      },
      {
        id:'stars-remnants',
        title:'3. Extreme Stellar Remnants',
        subtitle:'Explore neutron stars, pulsars, black holes, and interacting stars.',
        lessons:[
          {
            id:'stars-10',
            type:'lesson',
            title:'Neutron Stars',
            description:'Explore some of the densest objects in the universe.',
            duration:'7 min',
            xp:40,
            unlocked:false,
            completed:false,
            nasaSearch:'neutron star NICER',
            content:{
              intro:'Some massive-star supernovae leave behind neutron stars: extraordinarily compact stellar remnants.',
              sections:[
                {title:'Born from Collapse',text:'During collapse of a massive stellar core, matter can be compressed so intensely that protons and electrons combine, producing neutron-rich matter.'},
                {title:'Extreme Density',text:'A neutron star can pack more mass than the Sun into an object only tens of kilometers across, producing extremely strong gravity.'},
                {title:'Extreme Physics',text:'Neutron stars allow scientists to study matter under pressures and densities that cannot easily be reproduced on Earth.'}
              ],
              questions:[
                {id:'stars-10-q1',type:'multiple-choice',question:'A neutron star can form after:',answers:['A massive-star supernova','A planet cools','A molecular cloud evaporates','A comet collision'],correctAnswer:0,explanation:'Some massive-star supernovae leave neutron-star remnants.'},
                {id:'stars-10-q2',type:'true-false',question:'Neutron stars can contain more mass than the Sun in a region only tens of kilometers wide.',answers:['True','False'],correctAnswer:0,explanation:'Their extremely small size and high mass make them extraordinarily dense.'}
              ],
              keyFacts:['Neutron stars are compact stellar remnants.','They can result from massive-star supernovae.','They are extraordinarily dense.','They provide laboratories for extreme physics.']
            }
          },
          {
            id:'stars-11',
            type:'lesson',
            title:'Pulsars and Magnetars',
            description:'Meet rapidly spinning and highly magnetic neutron stars.',
            duration:'7 min',
            xp:40,
            unlocked:false,
            completed:false,
            nasaSearch:'pulsar neutron star magnetar',
            content:{
              intro:'Neutron stars can appear in remarkable forms. Pulsars produce regularly repeating signals, while magnetars possess exceptionally powerful magnetic fields.',
              sections:[
                {title:'Cosmic Lighthouses',text:'A pulsar is a rotating neutron star whose radiation beams sweep through space. If a beam repeatedly crosses Earth, astronomers detect regular pulses.'},
                {title:'Rapid Rotation',text:'Some pulsars rotate many times each second. Their extremely regular pulses can be measured with remarkable precision.'},
                {title:'Magnetars',text:'Magnetars are neutron stars with exceptionally strong magnetic fields. They can produce powerful bursts of high-energy radiation.'}
              ],
              questions:[
                {id:'stars-11-q1',type:'multiple-choice',question:'Why does a pulsar appear to pulse?',answers:['Its beam repeatedly sweeps across Earth','It repeatedly explodes','A planet covers it','Its gravity turns off'],correctAnswer:0,explanation:'Rotation causes the radiation beam to sweep across our line of sight.'},
                {id:'stars-11-q2',type:'multiple-choice',question:'What distinguishes magnetars?',answers:['Very strong magnetic fields','No gravity','Extremely cold surfaces only','They are galaxies'],correctAnswer:0,explanation:'Magnetars are neutron stars with exceptionally intense magnetic fields.'}
              ],
              keyFacts:['Pulsars are rotating neutron stars.','Their beams can act like cosmic lighthouses.','Some pulsars rotate extremely rapidly.','Magnetars possess exceptionally strong magnetic fields.']
            }
          },
          {
            id:'stars-12',
            type:'lesson',
            title:'Stellar-Mass Black Holes',
            description:'Learn how the heaviest stellar cores can collapse even further.',
            duration:'8 min',
            xp:45,
            unlocked:false,
            completed:false,
            nasaSearch:'stellar mass black hole',
            content:{
              intro:'If the remnant core of a massive star is sufficiently massive, gravity can overwhelm the mechanisms that support a neutron star and produce a black hole.',
              sections:[
                {title:'Collapse Continues',text:'For sufficiently massive remnants, even neutron-star matter cannot halt gravitational collapse. A stellar-mass black hole can form.'},
                {title:'The Event Horizon',text:'A black hole is surrounded by an event horizon. Once something passes inward through this boundary, it cannot return to the outside universe.'},
                {title:'Finding Invisible Objects',text:'Black holes themselves do not emit ordinary light from inside the event horizon. Astronomers detect them through their effects on nearby matter and radiation.'}
              ],
              questions:[
                {id:'stars-12-q1',type:'multiple-choice',question:'What can form when a sufficiently massive stellar core continues collapsing?',answers:['A stellar-mass black hole','A rocky planet','A molecular cloud immediately','A white dwarf in every case'],correctAnswer:0,explanation:'Sufficiently massive collapsed stellar remnants can form black holes.'},
                {id:'stars-12-q2',type:'true-false',question:'Light from inside a black hole’s event horizon can freely escape.',answers:['True','False'],correctAnswer:1,explanation:'The event horizon marks the boundary beyond which escape is impossible.'}
              ],
              keyFacts:['Some massive stars can leave black holes.','An event horizon surrounds a black hole.','Light cannot escape from inside the event horizon.','Astronomers often detect black holes indirectly.']
            }
          },
          {
            id:'stars-13',
            type:'lesson',
            title:'Binary Stars and Novae',
            description:'Discover what happens when stars evolve with companions.',
            duration:'7 min',
            xp:40,
            unlocked:false,
            completed:false,
            nasaSearch:'binary star nova white dwarf',
            content:{
              intro:'Many stars belong to binary systems. Interactions between nearby stars can produce phenomena impossible for isolated stars.',
              sections:[
                {title:'Two Stars Together',text:'A binary system contains two stars gravitationally bound to one another. Each star orbits their shared center of mass.'},
                {title:'Mass Transfer',text:'In close binary systems, material can sometimes flow from one star toward its companion as the stars evolve.'},
                {title:'Novae',text:'A nova can occur when a white dwarf accumulates material from a companion. Conditions on the white dwarf can trigger a thermonuclear outburst.'}
              ],
              questions:[
                {id:'stars-13-q1',type:'multiple-choice',question:'What is a binary star system?',answers:['Two gravitationally bound stars','One star with two planets','Two galaxies','Two black holes in every case'],correctAnswer:0,explanation:'Binary systems consist of two stars orbiting a common center of mass.'},
                {id:'stars-13-q2',type:'multiple-choice',question:'Which compact object is involved in known novae?',answers:['White dwarf','Asteroid','Brown planet','Galaxy cluster'],correctAnswer:0,explanation:'Novae occur in binary systems involving a white dwarf accreting material.'}
              ],
              keyFacts:['Binary systems contain two gravitationally bound stars.','Close binaries can exchange matter.','Novae involve white dwarfs in binary systems.','A nova is different from a supernova.']
            }
          },
          {
            id:'stars-quiz-3',
            type:'quiz',
            title:'Stellar Remnants Quiz',
            description:'Test yourself on neutron stars, pulsars, black holes, and binaries.',
            duration:'7 min',
            xp:60,
            unlocked:false,
            completed:false,
            nasaSearch:'neutron star black hole',
            content:{
              intro:'Complete the compact-object checkpoint.',
              sections:[],
              questions:[
                {id:'stars-quiz-3-q1',type:'multiple-choice',question:'Which object is the extremely dense remnant of some massive-star supernovae?',answers:['Neutron star','Gas giant','Main-sequence star','Molecular cloud'],correctAnswer:0,explanation:'Some supernova cores survive as neutron stars.'},
                {id:'stars-quiz-3-q2',type:'multiple-choice',question:'A pulsar is:',answers:['A rotating neutron star observed through periodic pulses','A type of planet','A galaxy merger','A protostar'],correctAnswer:0,explanation:'Pulsars are rotating neutron stars whose radiation beams periodically sweep past Earth.'},
                {id:'stars-quiz-3-q3',type:'multiple-choice',question:'What boundary surrounds a black hole?',answers:['Event horizon','Main sequence','Photosphere only','Planetary ring'],correctAnswer:0,explanation:'The event horizon is the boundary beyond which escape is impossible.'},
                {id:'stars-quiz-3-q4',type:'multiple-choice',question:'Known novae involve:',answers:['A white dwarf in a binary system','A lone asteroid','A newborn planet','Only supermassive black holes'],correctAnswer:0,explanation:'Novae occur in binaries in which a white dwarf accumulates material.'},
                {id:'stars-quiz-3-q5',type:'true-false',question:'Neutron stars and black holes can both result from the deaths of massive stars.',answers:['True','False'],correctAnswer:0,explanation:'The outcome depends strongly on the properties of the collapsing stellar core.'}
              ],
              keyFacts:['You completed Extreme Stellar Remnants.','Next: learn how astronomers classify and study stars.']
            }
          }
        ]
      },
      {
        id:'stars-understanding',
        title:'4. Understanding Stars',
        subtitle:'Learn how astronomers organize and study stellar populations.',
        lessons:[
          {
            id:'stars-14',
            type:'lesson',
            title:'Star Clusters',
            description:'Explore groups of stars that formed together.',
            duration:'6 min',
            xp:35,
            unlocked:false,
            completed:false,
            nasaSearch:'open star cluster globular cluster',
            content:{
              intro:'Stars are often found in groups called star clusters. Because many cluster members formed from the same cloud, clusters are valuable laboratories for studying stellar evolution.',
              sections:[
                {title:'Open Clusters',text:'Open clusters generally contain stars that formed together and remain relatively loosely bound. They are often associated with galactic disks.'},
                {title:'Globular Clusters',text:'Globular clusters are dense, roughly spherical collections containing large numbers of predominantly old stars.'},
                {title:'Why Clusters Matter',text:'Cluster stars can have similar ages and compositions but different masses, helping astronomers compare how mass influences stellar evolution.'}
              ],
              questions:[
                {id:'stars-14-q1',type:'multiple-choice',question:'Why are star clusters useful for studying stellar evolution?',answers:['Many members formed at roughly similar times','Every star has the same mass','They contain no gravity','They never change'],correctAnswer:0,explanation:'Shared ages and origins allow astronomers to compare stars with different masses.'},
                {id:'stars-14-q2',type:'multiple-choice',question:'Which type of cluster is generally dense and roughly spherical?',answers:['Globular cluster','Open cluster','Planetary system','Molecular filament'],correctAnswer:0,explanation:'Globular clusters are dense, roughly spherical stellar systems.'}
              ],
              keyFacts:['Cluster stars often share a common origin.','Open clusters are relatively loose groups.','Globular clusters are dense and roughly spherical.','Clusters help astronomers test stellar-evolution models.']
            }
          },
          {
            id:'stars-15',
            type:'lesson',
            title:'Spectral Classification',
            description:'Learn how astronomers classify stars using their light.',
            duration:'8 min',
            xp:40,
            unlocked:false,
            completed:false,
            nasaSearch:'stellar spectrum stars spectroscopy',
            content:{
              intro:'Astronomers can learn about stars by spreading their light into spectra. Spectral patterns reveal information about temperature and chemical composition.',
              sections:[
                {title:'Reading Starlight',text:'A spectrum separates light according to wavelength. Dark or bright spectral features are associated with interactions between light and matter.'},
                {title:'Spectral Classes',text:'Stars are commonly arranged into spectral classes O, B, A, F, G, K, and M, broadly ordered from hotter to cooler stellar surface temperatures.'},
                {title:'Our Sun',text:'The Sun is a G-type main-sequence star. Its spectrum contains numerous features that allow scientists to investigate the solar atmosphere and composition.'}
              ],
              questions:[
                {id:'stars-15-q1',type:'multiple-choice',question:'Which sequence lists stellar spectral classes from generally hotter to cooler?',answers:['O B A F G K M','M K G F A B O','A B C D E F G','G M O A K B F'],correctAnswer:0,explanation:'The standard temperature sequence is O, B, A, F, G, K, M.'},
                {id:'stars-15-q2',type:'multiple-choice',question:'What type of star is the Sun?',answers:['G-type main-sequence star','Neutron star','O-type supergiant','White dwarf'],correctAnswer:0,explanation:'The Sun is a G-type main-sequence star.'}
              ],
              keyFacts:['Spectroscopy separates starlight by wavelength.','Spectra reveal physical information about stars.','OBAFGKM broadly runs from hotter to cooler.','The Sun is a G-type main-sequence star.']
            }
          },
          {
            id:'stars-16',
            type:'lesson',
            title:'The Hertzsprung-Russell Diagram',
            description:'Learn how astronomers organize stars by luminosity and temperature.',
            duration:'8 min',
            xp:45,
            unlocked:false,
            completed:false,
            nasaSearch:'Hertzsprung Russell diagram star cluster',
            content:{
              intro:'The Hertzsprung-Russell diagram, or H-R diagram, is one of astronomy’s most important tools for understanding stellar properties and evolution.',
              sections:[
                {title:'Two Important Properties',text:'An H-R diagram compares stellar luminosity with surface temperature, spectral class, or a related color measurement.'},
                {title:'The Main Sequence',text:'Most hydrogen-fusing stars fall along a broad diagonal region called the main sequence. Hot luminous stars occupy one end while cool faint stars occupy the other.'},
                {title:'Giants and White Dwarfs',text:'Giants appear very luminous despite relatively cool surfaces because of their enormous sizes. White dwarfs are hot but faint because their radiating surfaces are small.'}
              ],
              questions:[
                {id:'stars-16-q1',type:'multiple-choice',question:'What two major properties are compared on an H-R diagram?',answers:['Luminosity and temperature','Age and distance only','Number of planets and rotation','Mass and distance only'],correctAnswer:0,explanation:'The H-R diagram organizes stars using luminosity and temperature or closely related measurements.'},
                {id:'stars-16-q2',type:'multiple-choice',question:'Why can a red giant be very luminous despite a cooler surface?',answers:['It has an enormous surface area','It has no gravity','It is actually a galaxy','Its temperature is zero'],correctAnswer:0,explanation:'Its very large radius gives it a huge radiating surface area.'}
              ],
              keyFacts:['The H-R diagram compares luminosity and temperature.','Main-sequence stars form a prominent diagonal band.','Giants are luminous because they are enormous.','White dwarfs are hot but relatively faint.']
            }
          },
          {
            id:'stars-final',
            type:'quiz',
            title:'Stars Final Challenge',
            description:'Complete the Stars category by reviewing the entire stellar life cycle.',
            duration:'10 min',
            xp:100,
            unlocked:false,
            completed:false,
            nasaSearch:'stellar life cycle stars',
            content:{
              intro:'You have reached the final Stars challenge. Review stellar birth, life, death, remnants, and classification.',
              sections:[],
              questions:[
                {id:'stars-final-q1',type:'multiple-choice',question:'Stars begin forming primarily in:',answers:['Molecular clouds','Black-hole event horizons','Planetary rings','Empty vacuum with no matter'],correctAnswer:0,explanation:'Dense regions of molecular clouds can collapse gravitationally to form stars.'},
                {id:'stars-final-q2',type:'multiple-choice',question:'What marks the beginning of the main sequence?',answers:['Stable core hydrogen fusion','Planet formation','A supernova','Formation of a white dwarf'],correctAnswer:0,explanation:'A star reaches the main sequence when stable hydrogen fusion is established in its core.'},
                {id:'stars-final-q3',type:'multiple-choice',question:'Which property most strongly influences a star’s evolutionary path?',answers:['Mass','Number of nearby planets','Constellation name','Distance from Earth'],correctAnswer:0,explanation:'A star’s mass strongly controls its lifetime and eventual fate.'},
                {id:'stars-final-q4',type:'multiple-choice',question:'What is the expected final remnant of the Sun?',answers:['White dwarf','Neutron star','Black hole','Supermassive black hole'],correctAnswer:0,explanation:'The Sun does not have enough mass to end as a neutron star or stellar-mass black hole.'},
                {id:'stars-final-q5',type:'multiple-choice',question:'What can a sufficiently massive star leave after a core-collapse supernova?',answers:['Neutron star or black hole','Only a planet','Always a white dwarf','A new galaxy'],correctAnswer:0,explanation:'Massive stellar cores may leave neutron stars or black holes.'},
                {id:'stars-final-q6',type:'multiple-choice',question:'A pulsar is associated with which object?',answers:['Neutron star','Red giant only','Planetary nebula only','Main-sequence Sun-like star only'],correctAnswer:0,explanation:'Pulsars are rotating neutron stars whose beams periodically cross our line of sight.'},
                {id:'stars-final-q7',type:'multiple-choice',question:'Which spectral sequence broadly runs from hotter to cooler stars?',answers:['O B A F G K M','M O G B K A F','A C E G I K M','G F M O K A B'],correctAnswer:0,explanation:'OBAFGKM is the standard sequence from hotter to cooler spectral classes.'},
                {id:'stars-final-q8',type:'multiple-choice',question:'What does an H-R diagram primarily compare?',answers:['Luminosity and temperature','Distance and age only','Planet count and mass','Rotation and distance only'],correctAnswer:0,explanation:'H-R diagrams compare stellar luminosity with temperature or related spectral/color measurements.'},
                {id:'stars-final-q9',type:'true-false',question:'Supernova ejecta can contribute material to future generations of stars and planets.',answers:['True','False'],correctAnswer:0,explanation:'Stellar ejecta enrich interstellar material that may later become part of new stars and planets.'},
                {id:'stars-final-q10',type:'true-false',question:'Every star eventually becomes a black hole.',answers:['True','False'],correctAnswer:1,explanation:'Only some sufficiently massive stellar remnants form black holes; lower-mass stars have different outcomes.'}
              ],
              keyFacts:['Stars are born from collapsing molecular-cloud material.','Most stars spend most of their lives on the main sequence.','Mass strongly controls stellar evolution.','Sun-like stars can end as white dwarfs.','Some massive stars explode as supernovae and leave neutron stars or black holes.','Stellar material is recycled into future generations of cosmic objects.']
            }
          }
        ]
      }
    ]
  },
  galaxies:{
    id:'galaxies',
    title:'Galaxies',
    icon:'🌌',
    description:'Island universes: spirals, ellipticals, and the Milky Way.',
    rank:'BRONZE',
    level:1,
    sections:[
      {
        id:'galaxies-foundations',
        title:'Galaxy Foundations',
        subtitle:'Explore the enormous structures of the universe.',
        lessons:[
          {
            id:'galaxies-1',
            type:'lesson',
            title:'What is a Galaxy?',
            description:'Learn what galaxies contain and how large they can become.',
            duration:'5 min',
            xp:25,
            unlocked:false,
            completed:false
          },
          {
            id:'galaxies-2',
            type:'lesson',
            title:'Types of Galaxies',
            description:'Explore spiral, elliptical, and irregular galaxies.',
            duration:'7 min',
            xp:30,
            unlocked:false,
            completed:false
          },
          {
            id:'galaxies-quiz-1',
            type:'quiz',
            title:'Galaxy Foundations Quiz',
            description:'Test your knowledge of galaxy types.',
            duration:'5 min',
            xp:50,
            :false,
            completed:false
          }
        ]
      }
    ]
  },
  cosmology:{
    id:'cosmology',
    title:'Cosmology',
    icon:'✳',
    description:'The origin, evolution, and fate of the universe.',
    rank:'BRONZE',
    level:1,
    sections:[
      {
        id:'cosmology-foundations',
        title:'Cosmology Foundations',
        subtitle:'Begin exploring the universe as a whole.',
        lessons:[
          {
            id:'cosmology-1',
            type:'lesson',
            title:'What is Cosmology?',
            description:'Learn what cosmologists study.',
            duration:'5 min',
            xp:25,
            :true,
            completed:false
          },
          {
            id:'cosmology-2',
            type:'lesson',
            title:'The Big Bang',
            description:'Explore the early history of the universe.',
            duration:'8 min',
            xp:35,
            :false,
            completed:false
          },
          {
            id:'cosmology-quiz-1',
            type:'quiz',
            title:'Cosmology Foundations Quiz',
            description:'Test your understanding of basic cosmology.',
            duration:'5 min',
            xp:50,
            :false,
            completed:false
          }
        ]
      }
    ]
  },
  planets:{
    id:'planets',
    title:'Planets',
    icon:'🪐',
    description:"Our solar system's worlds and the hunt for exoplanets.",
    rank:'BRONZE',
    level:1,
    sections:[
      {
        id:'planets-foundations',
        title:'Planetary Foundations',
        subtitle:'Learn how planets form and how they differ.',
        lessons:[
          {
            id:'planets-1',
            type:'lesson',
            title:'What is a Planet?',
            description:'Learn the basic characteristics of planets.',
            duration:'5 min',
            xp:25,
            :true,
            completed:false
          },
          {
            id:'planets-2',
            type:'lesson',
            title:'Terrestrial Planets',
            description:'Explore Mercury, Venus, Earth, and Mars.',
            duration:'7 min',
            xp:30,
            :false,
            completed:false
          },
          {
            id:'planets-quiz-1',
            type:'quiz',
            title:'Planet Foundations Quiz',
            description:'Test your understanding of planets.',
            duration:'5 min',
            xp:50,
            unlocked:true,
            completed:false
          }
        ]
      }
    ]
  },
  nebulae:{
    id:'nebulae',
    title:'Nebulae',
    icon:'☁️',
    description:'Cosmic clouds where stars and planets are forged.',
    rank:'BRONZE',
    level:1,
    sections:[
      {
        id:'nebulae-foundations',
        title:'Nebula Foundations',
        subtitle:'Explore enormous clouds of gas and dust.',
        lessons:[
          {
            id:'nebulae-1',
            type:'lesson',
            title:'What is a Nebula?',
            description:'Learn what nebulae are made of.',
            duration:'5 min',
            xp:25,
            unlocked:true,
            completed:false
          },
          {
            id:'nebulae-2',
            type:'lesson',
            title:'Emission Nebulae',
            description:'Discover why some nebulae glow.',
            duration:'7 min',
            xp:30,
            unlocked:false,
            completed:false
          },
          {
            id:'nebulae-quiz-1',
            type:'quiz',
            title:'Nebula Foundations Quiz',
            description:'Test your understanding of nebulae.',
            duration:'5 min',
            xp:50,
            unlocked:false,
            completed:false
          }
        ]
      }
    ]
  },
  observing:{
    id:'observing',
    title:'Observing',
    icon:'🔭',
    description:'Tips for naked-eye, binocular, and telescope astronomy.',
    rank:'BRONZE',
    level:1,
    sections:[
      {
        id:'observing-foundations',
        title:'Observing Foundations',
        subtitle:'Learn how to explore the night sky.',
        lessons:[
          {
            id:'observing-1',
            type:'lesson',
            title:'Reading the Night Sky',
            description:'Learn how to orient yourself under the stars.',
            duration:'5 min',
            xp:25,
            unlocked:true,
            completed:false
          },
          {
            id:'observing-2',
            type:'lesson',
            title:'Using Binoculars',
            description:'Learn how binoculars can reveal more of the night sky.',
            duration:'6 min',
            xp:30,
            unlocked:false,
            completed:false
          },
          {
            id:'observing-quiz-1',
            type:'quiz',
            title:'Observing Foundations Quiz',
            description:'Test your basic observing knowledge.',
            duration:'5 min',
            xp:50,
            unlocked:false,
            completed:false
          }
        ]
      }
    ]
  }
};
