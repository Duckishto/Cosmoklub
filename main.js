const { createApp } = Vue;

// ---------- SVG Icon Templates ----------
const SVGS = {
  telescope: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  satellite: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>`,
  layers: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  cpu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
};

const OBJ_SVGS = {
  galaxy: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#a855f7" stroke-width="1.2" opacity="0.6" transform="rotate(-25 20 20)"/><ellipse cx="20" cy="20" rx="12" ry="4" stroke="#c084fc" stroke-width="1" opacity="0.5" transform="rotate(-25 20 20)"/><circle cx="20" cy="20" r="2.5" fill="#e9d5ff" opacity="0.9"/></svg>`,
  nebula: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><radialGradient id="nb" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e9d5ff" stop-opacity="0.8"/><stop offset="60%" stop-color="#a855f7" stop-opacity="0.4"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/></radialGradient><circle cx="20" cy="20" r="18" fill="url(#nb)"/><circle cx="20" cy="20" r="4" fill="#e9d5ff" opacity="0.9"/></svg>`,
  cluster: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="1.8" fill="#f5f3ff"/><circle cx="14" cy="16" r="1.4" fill="#e9d5ff" opacity="0.9"/><circle cx="26" cy="16" r="1.4" fill="#e9d5ff" opacity="0.9"/><circle cx="14" cy="24" r="1.4" fill="#e9d5ff" opacity="0.8"/><circle cx="26" cy="24" r="1.4" fill="#e9d5ff" opacity="0.8"/><circle cx="20" cy="12" r="1.2" fill="#c084fc" opacity="0.8"/><circle cx="20" cy="28" r="1.2" fill="#c084fc" opacity="0.8"/></svg>`,
  ring: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" stroke="#a855f7" stroke-width="1.5" opacity="0.5" stroke-dasharray="3 2"/><circle cx="20" cy="20" r="9" stroke="#c084fc" stroke-width="2" opacity="0.6"/><circle cx="20" cy="20" r="4" fill="#e9d5ff" opacity="0.85"/></svg>`,
  supernova: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="5" fill="#f5f3ff" opacity="0.95"/><line x1="20" y1="4" x2="20" y2="12" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="28" x2="20" y2="36" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round"/><line x1="4" y1="20" x2="12" y2="20" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round"/><line x1="28" y1="20" x2="36" y2="20" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  whirlpool: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 20 Q28 10 32 20 Q28 32 20 28 Q12 24 14 16 Q18 8 26 12" stroke="#a855f7" stroke-width="1.4" fill="none" opacity="0.7" stroke-linecap="round"/><circle cx="20" cy="20" r="3" fill="#c084fc" opacity="0.9"/></svg>`,
  globular: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" fill="none" stroke="#7c3aed" stroke-width="0.8" opacity="0.3"/><circle cx="20" cy="20" r="3" fill="#f5f3ff" opacity="0.95"/><circle cx="20" cy="12" r="1.5" fill="#e9d5ff" opacity="0.85"/><circle cx="20" cy="28" r="1.5" fill="#e9d5ff" opacity="0.85"/><circle cx="12" cy="20" r="1.5" fill="#e9d5ff" opacity="0.85"/><circle cx="28" cy="20" r="1.5" fill="#e9d5ff" opacity="0.85"/></svg>`,
  lagoon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><radialGradient id="lg" cx="45%" cy="55%" r="50%"><stop offset="0%" stop-color="#c084fc" stop-opacity="0.8"/><stop offset="70%" stop-color="#7c3aed" stop-opacity="0.3"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/></radialGradient><ellipse cx="20" cy="22" rx="16" ry="11" fill="url(#lg)"/><circle cx="18" cy="20" r="2.5" fill="#f5f3ff" opacity="0.9"/></svg>`,
};

// ---------- Complete Translations ----------
const translations = {
  EN: {
    navHome: 'Home', navExplore: 'Explore', navObjects: 'Objects', navAbout: 'About',
    eyebrow: 'Next-Gen Astronomy Platform',
    heroLine1: 'Explore the', heroAccent: 'Night Sky', heroLine2: 'with Precision',
    heroSub: 'Discover celestial objects, plan observations, analyze astronomical data, and connect with the <span class="kw">global astronomy community</span>.',
    startBtn: 'Start Exploring', learnBtn: 'Learn more',
    featLabel: 'Features', featTitle: 'Everything the cosmos demands',
    featSub: '<span class="kw">Precision tools</span> for amateur observers and professional researchers alike.',
    objLabel: 'Objects', objTitle: 'Deep-sky catalogue',
    objSub: '<span class="kw">Thousands of catalogued objects</span> from our expanding database.',
    ctaLabel: 'Join CosmoKlub', ctaTitle: 'Your observatory awaits',
    ctaSub: 'Create your <span class="kw">free account</span> and start mapping the cosmos tonight.',
    signIn: 'Sign In', register: 'Register',
    createAcc: 'Create Account', welcomeBack: 'Welcome back',
    loginSub: 'Sign in to your observatory', joinUs: 'Join thousands of astronomers',
    firstName: 'First Name', lastName: 'Last Name', firstPH: 'Galileo', lastPH: 'Galilei',
    emailLabel: 'Email', emailPH: 'you@cosmos.space', passLabel: 'Password',
    passPH: 'Min. 8 characters', confirmPass: 'Confirm Password', confirmPH: 'Repeat password',
    tosAgree: 'I agree to the', tosAnd: 'and', forgotPass: 'Forgot password?',
    orContinue: 'or continue with', loading: 'Loading...',
    successReg: 'Welcome to CosmoKlub', successLogin: 'Welcome back',
    successSub: 'Your observatory is ready. Start exploring the cosmos.',
    exploreNow: 'Explore Now',
    tos: 'Terms of Service', privacy: 'Privacy Policy', contact: 'Contact',
    rights: 'All rights reserved.', tosDate: 'Last updated June 2026',
    accept: 'I Accept',
    tos1Title: 'Acceptance of Terms',
    tos1Body: 'By accessing or using CosmoKlub ("the Service"), you confirm that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all of these terms, you must not use the Service. We may update these Terms at any time; continued use after changes constitutes your acceptance of the revised Terms.',
    tos2Title: 'Eligibility & Account Responsibility',
    tos2Body: 'You must be at least 13 years old to create an account. You are responsible for keeping your login credentials confidential and for all activity that occurs under your account. Notify us immediately at hello@cosmoklub.space if you suspect any unauthorised access. CosmoKlub is not liable for losses arising from your failure to protect your credentials.',
    tos3Title: 'Permitted Use of the Service',
    tos3Body: 'CosmoKlub grants you a personal, non-exclusive, non-transferable licence to use the Service for lawful astronomical observation, research, education, and community discussion. You may not use the Service to violate any applicable law, infringe third-party rights, distribute malware, scrape data without permission, or engage in any activity that disrupts or damages the platform.',
    tos4Title: 'Community Chat & Messaging',
    tos4Body: 'Our chat and messaging features are provided to foster a respectful astronomy community. You agree not to send spam, unsolicited promotions, hate speech, harassment, threats, sexually explicit content, or any content that targets individuals on the basis of race, religion, gender, sexual orientation, disability, or nationality. CosmoKlub may monitor messages for safety purposes and reserves the right to remove content or terminate accounts that violate these standards without prior notice.',
    tos5Title: 'User-Generated Content & Posts',
    tos5Body: 'You retain ownership of content you post (observations, photos, comments, logbook entries). By posting, you grant CosmoKlub a worldwide, royalty-free, sublicensable licence to display, distribute, and promote that content within the Service. You represent that you own or have the necessary rights to all content you submit, and that it does not infringe any copyright, trademark, privacy, or other rights. CosmoKlub may remove any content that violates these Terms or that we deem harmful, misleading, or off-topic.',
    tos6Title: 'AI Features & Automated Tools',
    tos6Body: 'CosmoKlub offers AI-powered features including Pensia (our astronomy AI assistant) and AI Object Recognition for astrophotographs. These tools are provided as-is and may produce inaccurate, incomplete, or outdated results. Do not rely solely on AI output for critical decisions. You may not attempt to reverse-engineer, manipulate, or misuse AI features. Content submitted to AI tools (e.g., uploaded photos) may be processed by third-party model providers subject to their own data handling policies; no personally identifiable information is stored beyond session duration.',
    tos7Title: 'Data, Privacy & Cookies',
    tos7Body: 'We collect only the data necessary to operate, improve, and personalise the Service (account information, usage logs, observation data). Your personal information is never sold to third parties. We use cookies for authentication and analytics; you may disable non-essential cookies in your browser settings. Full details are in our Privacy Policy. Users in the EU/EEA have the right to access, correct, or delete their personal data by contacting hello@cosmoklub.space.',
    tos8Title: 'Intellectual Property',
    tos8Body: 'All original content, software, databases, 3D models, visual designs, and tools within the Service are the intellectual property of CosmoKlub and its licensors, protected by international copyright, trademark, and database laws. You may not copy, redistribute, or create derivative works from any CosmoKlub content without prior written permission. Astronomical data sourced from public catalogues (NASA, ESA, IAU) remains subject to their respective licences.',
    tos9Title: 'Limitation of Liability & Disclaimers',
    tos9Body: 'The Service and all astronomical data are provided "as is" without warranties of any kind, express or implied, including accuracy, completeness, or fitness for a particular purpose. To the maximum extent permitted by law, CosmoKlub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, even if advised of the possibility of such damages.',
    tos10Title: 'Termination & Governing Law',
    tos10Body: 'CosmoKlub reserves the right to suspend or permanently terminate your account at any time for breach of these Terms, without notice or liability. You may delete your account at any time via account settings. These Terms are governed by the laws of the jurisdiction in which CosmoKlub operates, and any disputes shall be resolved in the competent courts of that jurisdiction. If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect.',
    errFirst: 'First name is required', errLast: 'Last name is required',
    errEmail: 'A valid email is required', errPass: 'Password must be at least 8 characters',
    errConfirm: 'Passwords do not match', errTos: 'You must accept the Terms of Service',
    toastReg: 'Account created. Welcome to CosmoKlub.', toastLogin: 'Signed in successfully.'
  },
  ES: {
    navHome: 'Inicio', navExplore: 'Explorar', navObjects: 'Objetos', navAbout: 'Acerca de',
    eyebrow: 'Plataforma de astronomia de nueva generacion',
    heroLine1: 'Navega por el', heroAccent: 'Universo', heroLine2: 'desde tu pantalla.',
    heroSub: 'Datos celestes en tiempo real, catalogos y <span class="kw">mapas interactivos</span> — todo en un panel oscuro y elegante.',
    startBtn: 'Comenzar', learnBtn: 'Mas info',
    featLabel: 'Funciones', featTitle: 'Todo lo que el cosmos exige.',
    featSub: '<span class="kw">Herramientas de precision</span> para observadores e investigadores.',
    objLabel: 'Objetos', objTitle: 'Catalogo de cielo profundo.',
    objSub: '<span class="kw">Miles de objetos catalogados</span> en nuestra base de datos.',
    ctaLabel: 'Unete', ctaTitle: 'Tu observatorio te espera.',
    ctaSub: 'Crea tu <span class="kw">cuenta gratuita</span> y empieza a mapear el cosmos esta noche.',
    signIn: 'Iniciar sesion', register: 'Registrarse',
    createAcc: 'Crear cuenta', welcomeBack: 'Bienvenido de nuevo',
    loginSub: 'Inicia sesion en tu observatorio', joinUs: 'Unete a miles de astronomos',
    firstName: 'Nombre', lastName: 'Apellido', firstPH: 'Galileo', lastPH: 'Galilei',
    emailLabel: 'Correo', emailPH: 'tu@cosmos.space', passLabel: 'Contrasena',
    passPH: 'Min. 8 caracteres', confirmPass: 'Confirmar', confirmPH: 'Repite la contrasena',
    tosAgree: 'Acepto los', tosAnd: 'y la', forgotPass: 'Olvidaste tu contrasena?',
    orContinue: 'o continuar con', loading: 'Cargando...',
    successReg: 'Bienvenido a CosmoKlub!', successLogin: 'Bienvenido de nuevo!',
    successSub: 'Tu observatorio esta listo.', exploreNow: 'Explorar ahora',
    tos: 'Terminos', privacy: 'Privacidad', contact: 'Contacto',
    rights: 'Todos los derechos reservados.', tosDate: 'Junio 2026', accept: 'Acepto',
    tos1Title: 'Aceptacion de los Terminos',
    tos1Body: 'Al acceder o utilizar CosmoKlub, confirmas que has leido, comprendido y aceptas estos Terminos de Servicio y nuestra Politica de Privacidad. Si no aceptas todos los terminos, no debes utilizar el Servicio. Podemos actualizar estos Terminos en cualquier momento; el uso continuado tras los cambios constituye tu aceptacion.',
    tos2Title: 'Elegibilidad y Responsabilidad de la Cuenta',
    tos2Body: 'Debes tener al menos 13 anos para crear una cuenta. Eres responsable de mantener la confidencialidad de tus credenciales y de toda la actividad que ocurra en tu cuenta. Notificanos de inmediato a hello@cosmoklub.space si sospechas de acceso no autorizado.',
    tos3Title: 'Uso Permitido del Servicio',
    tos3Body: 'CosmoKlub te otorga una licencia personal, no exclusiva e intransferible para usar el Servicio con fines de observacion astronomica, investigacion, educacion y discusion comunitaria legales. No puedes usar el Servicio para violar leyes, infringir derechos de terceros, distribuir malware o interferir con la plataforma.',
    tos4Title: 'Chat Comunitario y Mensajeria',
    tos4Body: 'Las funciones de chat estan pensadas para fomentar una comunidad de astronomia respetuosa. Queda prohibido enviar spam, discurso de odio, acoso, amenazas, contenido sexualmente explicito o contenido que discrimine por raza, religion, genero, orientacion sexual, discapacidad o nacionalidad. CosmoKlub puede eliminar contenido o cancelar cuentas que violen estas normas.',
    tos5Title: 'Contenido Generado por Usuarios y Publicaciones',
    tos5Body: 'Conservas la propiedad del contenido que publicas (observaciones, fotos, comentarios). Al publicar, otorgas a CosmoKlub una licencia mundial, libre de regalias para mostrar y distribuir ese contenido dentro del Servicio. Declaras que posees los derechos necesarios sobre el contenido enviado y que no infringe derechos de terceros.',
    tos6Title: 'Funciones de IA y Herramientas Automatizadas',
    tos6Body: 'CosmoKlub ofrece funciones de IA, incluyendo a Pensia (asistente de astronomia) y el Reconocimiento de Objetos con IA. Estas herramientas se proporcionan tal cual y pueden producir resultados inexactos. No debes depender exclusivamente de la IA para decisiones criticas. El contenido enviado a las herramientas de IA puede ser procesado por proveedores externos.',
    tos7Title: 'Datos, Privacidad y Cookies',
    tos7Body: 'Recopilamos solo los datos necesarios para operar y personalizar el Servicio. Tu informacion personal nunca se vende. Usamos cookies para autenticacion y analitica. Los usuarios en la UE/EEE tienen derecho a acceder, corregir o eliminar sus datos personales contactando hello@cosmoklub.space.',
    tos8Title: 'Propiedad Intelectual',
    tos8Body: 'Todo el contenido original, software, bases de datos, modelos 3D y disenos del Servicio son propiedad intelectual de CosmoKlub y sus licenciantes. No puedes copiar, redistribuir ni crear obras derivadas sin permiso previo por escrito.',
    tos9Title: 'Limitacion de Responsabilidad',
    tos9Body: 'El Servicio y todos los datos astronomicos se proporcionan "tal cual", sin garantias de ningun tipo. En la maxima medida permitida por la ley, CosmoKlub no sera responsable de danos indirectos, incidentales, especiales o consecuentes derivados del uso del Servicio.',
    tos10Title: 'Terminacion y Ley Aplicable',
    tos10Body: 'CosmoKlub puede suspender o cancelar tu cuenta en cualquier momento por incumplimiento de estos Terminos. Puedes eliminar tu cuenta en la configuracion. Estos Terminos se rigen por las leyes de la jurisdiccion donde opera CosmoKlub. Si alguna disposicion resulta inaplicable, el resto permanece vigente.',
    errFirst: 'El nombre es obligatorio', errLast: 'El apellido es obligatorio',
    errEmail: 'Correo valido requerido', errPass: 'Minimo 8 caracteres',
    errConfirm: 'Las contrasenlas no coinciden', errTos: 'Debes aceptar los Terminos',
    toastReg: 'Cuenta creada.', toastLogin: 'Sesion iniciada.'
  },
  FR: {
    navHome: 'Accueil', navExplore: 'Explorer', navObjects: 'Objets', navAbout: 'A propos',
    eyebrow: 'Plateforme astronomique nouvelle generation',
    heroLine1: "Naviguez dans l'", heroAccent: 'Univers', heroLine2: 'depuis votre ecran.',
    heroSub: "Donnees celestes en temps reel, catalogues et <span class=\"kw\">cartes interactives</span> — dans un tableau de bord sombre et elegant.",
    startBtn: 'Commencer', learnBtn: 'En savoir plus',
    featLabel: 'Fonctionnalites', featTitle: 'Tout ce que le cosmos exige.',
    featSub: "<span class=\"kw\">Outils de precision</span> pour observateurs et chercheurs.",
    objLabel: 'Objets', objTitle: 'Catalogue du ciel profond.',
    objSub: "<span class=\"kw\">Des milliers d'objets catalogues</span>.",
    ctaLabel: 'Rejoindre', ctaTitle: 'Votre observatoire vous attend.',
    ctaSub: 'Creez votre <span class="kw">compte gratuit</span> ce soir.',
    signIn: 'Connexion', register: "S'inscrire",
    createAcc: 'Creer un compte', welcomeBack: 'Bon retour',
    loginSub: 'Connectez-vous a votre observatoire', joinUs: "Rejoignez des milliers d'astronomes",
    firstName: 'Prenom', lastName: 'Nom', firstPH: 'Galilee', lastPH: 'Galilei',
    emailLabel: 'E-mail', emailPH: 'vous@cosmos.space', passLabel: 'Mot de passe',
    passPH: 'Min. 8 caracteres', confirmPass: 'Confirmer', confirmPH: 'Repetez le mot de passe',
    tosAgree: "J'accepte les", tosAnd: 'et la', forgotPass: 'Mot de passe oublie ?',
    orContinue: 'ou continuer avec', loading: 'Chargement...',
    successReg: 'Bienvenue sur CosmoKlub !', successLogin: 'Bon retour !',
    successSub: 'Votre observatoire est pret.', exploreNow: 'Explorer',
    tos: "Conditions", privacy: 'Confidentialite', contact: 'Contact',
    rights: 'Tous droits reserves.', tosDate: 'Juin 2026', accept: "J'accepte",
    tos1Title: 'Acceptation des Conditions',
    tos1Body: "En accedant ou en utilisant CosmoKlub, vous confirmez avoir lu, compris et accepte les presentes Conditions d'Utilisation ainsi que notre Politique de Confidentialite. Si vous n'acceptez pas toutes ces conditions, vous ne devez pas utiliser le Service. Nous pouvons les mettre a jour a tout moment ; la poursuite de l'utilisation vaut acceptation des modifications.",
    tos2Title: 'Eligibilite et Responsabilite du Compte',
    tos2Body: "Vous devez avoir au moins 13 ans pour creer un compte. Vous etes responsable de la confidentialite de vos identifiants et de toute activite sur votre compte. Contactez-nous immediatement a hello@cosmoklub.space en cas d'acces non autorise.",
    tos3Title: 'Utilisation Autorisee du Service',
    tos3Body: "CosmoKlub vous accorde une licence personnelle, non exclusive et non cessible pour utiliser le Service a des fins legales d'observation, de recherche, d'education et de discussion communautaire. Tout usage contraire a la loi, portant atteinte aux droits de tiers ou nuisant a la plateforme est interdit.",
    tos4Title: 'Chat Communautaire et Messagerie',
    tos4Body: "Les fonctionnalites de chat et de messagerie sont destinees a favoriser une communaute astronomique respectueuse. Il est interdit d'envoyer du spam, des discours haineux, du harcelement, des menaces, du contenu sexuellement explicite ou des propos discriminatoires. CosmoKlub peut supprimer du contenu ou resilier des comptes sans preavis.",
    tos5Title: 'Contenu Utilisateur et Publications',
    tos5Body: "Vous conservez la propriete du contenu que vous publiez (observations, photos, commentaires). En publiant, vous accordez a CosmoKlub une licence mondiale, libre de droits, pour afficher et distribuer ce contenu dans le Service. Vous declarez disposer de tous les droits necessaires sur le contenu soumis.",
    tos6Title: "Fonctionnalites IA et Outils Automatises",
    tos6Body: "CosmoKlub propose des fonctionnalites d'IA, notamment Pensia (assistante astronomique) et la Reconnaissance d'Objets par IA. Ces outils sont fournis en l'etat et peuvent produire des resultats inexacts. Ne prenez pas de decisions critiques en vous fiant uniquement a l'IA. Le contenu soumis aux outils d'IA peut etre traite par des fournisseurs tiers.",
    tos7Title: 'Donnees, Confidentialite et Cookies',
    tos7Body: "Nous collectons uniquement les donnees necessaires au fonctionnement et a la personnalisation du Service. Vos informations personnelles ne sont jamais vendues. Nous utilisons des cookies pour l'authentification et l'analyse. Les utilisateurs de l'UE/EEE peuvent acceder a leurs donnees, les rectifier ou les supprimer via hello@cosmoklub.space.",
    tos8Title: 'Propriete Intellectuelle',
    tos8Body: "Tout le contenu original, les logiciels, les bases de donnees, les modeles 3D et les outils du Service sont la propriete intellectuelle de CosmoKlub et de ses licenseurs. Toute reproduction, redistribution ou creation d'oeuvres derivees sans autorisation ecrite prealable est interdite.",
    tos9Title: 'Limitation de Responsabilite',
    tos9Body: "Le Service et les donnees astronomiques sont fournis \"en l'etat\", sans aucune garantie. Dans toute la mesure permise par la loi, CosmoKlub ne saurait etre tenu responsable de dommages indirects, accessoires ou consequents resultant de l'utilisation ou de l'impossibilite d'utiliser le Service.",
    tos10Title: 'Resiliation et Droit Applicable',
    tos10Body: "CosmoKlub peut suspendre ou resilier votre compte a tout moment en cas de violation des presentes Conditions. Vous pouvez supprimer votre compte via les parametres. Ces Conditions sont regies par les lois de la juridiction dans laquelle opere CosmoKlub. Si une disposition s'avere inapplicable, les autres restent en vigueur.",
    errFirst: 'Le prenom est obligatoire', errLast: 'Le nom est obligatoire',
    errEmail: 'E-mail valide requis', errPass: 'Minimum 8 caracteres',
    errConfirm: 'Les mots de passe ne correspondent pas', errTos: "Vous devez accepter les conditions",
    toastReg: 'Compte cree.', toastLogin: 'Connexion reussie.'
  },
  JA: {
    navHome: 'ホーム', navExplore: '探索', navObjects: '天体', navAbout: '概要',
    eyebrow: '次世代天文学プラットフォーム',
    heroLine1: '宇宙を', heroAccent: '探索', heroLine2: 'あなたの画面から。',
    heroSub: 'リアルタイム天体データ、深宇宙カタログ、<span class="kw">インタラクティブ星図</span> — 美しいダッシュボードで。',
    startBtn: '探索を始める', learnBtn: '詳細を見る',
    featLabel: '機能', featTitle: '宇宙が求めるすべて。',
    featSub: 'アマチュアからプロまで対応した<span class="kw">精密ツール</span>。',
    objLabel: '天体', objTitle: '深宇宙カタログ。',
    objSub: '<span class="kw">数千の天体をカタログ化</span>。',
    ctaLabel: '参加', ctaTitle: 'あなたの天文台が待っています。',
    ctaSub: '<span class="kw">無料アカウント</span>を作成して今夜から宇宙を探索。',
    signIn: 'ログイン', register: '登録',
    createAcc: 'アカウント作成', welcomeBack: 'おかえり',
    loginSub: '天文台にログイン', joinUs: '何千人もの天文学者に参加',
    firstName: '名', lastName: '姓', firstPH: 'ガリレオ', lastPH: 'ガリレイ',
    emailLabel: 'メール', emailPH: 'you@cosmos.space', passLabel: 'パスワード',
    passPH: '8文字以上', confirmPass: '確認', confirmPH: 'パスワードを繰り返す',
    tosAgree: '私は', tosAnd: 'と', forgotPass: 'パスワードを忘れた？',
    orContinue: 'または', loading: '読み込み中...',
    successReg: 'ようこそ！', successLogin: 'おかえりなさい！',
    successSub: '天文台の準備ができました。', exploreNow: '今すぐ探索',
    tos: '利用規約', privacy: 'プライバシー', contact: 'お問い合わせ',
    rights: 'All rights reserved.', tosDate: '2026年6月', accept: '同意する',
    tos1Title: '利用規約への同意',
    tos1Body: 'CosmoKlub（以下「本サービス」）にアクセスまたは使用することで、本利用規約およびプライバシーポリシーを読み、理解し、同意したことを確認します。すべての条項に同意しない場合、本サービスを使用してはなりません。当社は随時本規約を更新することがあり、更新後の継続使用は改定規約への同意とみなされます。',
    tos2Title: '資格とアカウント責任',
    tos2Body: 'アカウントを作成するには13歳以上である必要があります。ログイン情報の機密性を維持し、アカウントで発生するすべての活動に責任を負います。不正アクセスが疑われる場合はhello@cosmoklub.spaceまで直ちに通知してください。',
    tos3Title: '許可された使用',
    tos3Body: 'CosmoKlubは、合法的な天文観測、研究、教育、およびコミュニティ討議のために、個人的、非独占的かつ譲渡不可のライセンスを付与します。法律違反、第三者の権利侵害、マルウェア配布、またはプラットフォームを妨害する行為への使用は禁止です。',
    tos4Title: 'コミュニティチャットとメッセージング',
    tos4Body: 'チャット機能は敬意あるコミュニティを育むために提供されます。スパム、ヘイトスピーチ、嫌がらせ、脅迫、性的に露骨なコンテンツ、または人種・宗教・性別・性的指向・障害・国籍に基づく差別的コンテンツの送信は禁止されています。CosmoKlubは違反コンテンツの削除またはアカウントの停止を事前通知なく行う権利を有します。',
    tos5Title: 'ユーザー生成コンテンツと投稿',
    tos5Body: '投稿したコンテンツ（観測記録、写真、コメントなど）の所有権はあなたに帰属します。投稿により、CosmoKlubに対してサービス内でのコンテンツ表示・配布のための全世界的かつロイヤルティフリーのライセンスを付与します。投稿コンテンツについてすべての必要な権利を所有していることを表明します。',
    tos6Title: 'AI機能と自動化ツール',
    tos6Body: 'CosmoKlubはPensia（天文AIアシスタント）やAI天体認識などのAI機能を提供します。これらのツールは現状のまま提供され、不正確な結果が生じることがあります。重要な判断にAI出力のみを依拠しないでください。AIツールに送信されたコンテンツはサードパーティのモデルプロバイダーが処理する場合があります。',
    tos7Title: 'データ、プライバシーとクッキー',
    tos7Body: 'サービスの運営とパーソナライズに必要なデータのみを収集します。個人情報を第三者に販売することはありません。認証と分析のためにクッキーを使用します。EU/EEA内のユーザーはhello@cosmoklub.spaceに連絡することで個人データへのアクセス、訂正、または削除を要求できます。',
    tos8Title: '知的財産',
    tos8Body: 'サービス内のすべてのオリジナルコンテンツ、ソフトウェア、データベース、3Dモデル、デザインはCosmoKlubおよびそのライセンサーの知的財産です。事前の書面による許可なく、複製、再配布、または二次的著作物の作成を行うことはできません。',
    tos9Title: '責任の制限と免責事項',
    tos9Body: 'サービスおよびすべての天文データは、正確性、完全性、特定目的への適合性を含む明示または黙示のいかなる保証もなく「現状のまま」提供されます。法律で認められる最大限の範囲で、CosmoKlubはサービスの使用または使用不能から生じる間接的、偶発的、特別または結果的損害について責任を負いません。',
    tos10Title: '終了と準拠法',
    tos10Body: 'CosmoKlubは、本規約違反があった場合、通知なくいつでもアカウントを停止または永久に終了する権利を有します。アカウント設定からいつでもアカウントを削除できます。本規約はCosmoKlubが運営する管轄区域の法律に準拠し、紛争は当該管轄区域の裁判所で解決されます。',
    errFirst: '名前は必須です', errLast: '姓は必須です',
    errEmail: '有効なメールが必要です', errPass: '8文字以上必要です',
    errConfirm: 'パスワードが一致しません', errTos: '利用規約に同意が必要です',
    toastReg: 'アカウント作成完了。', toastLogin: 'ログイン成功。'
  },
  TH: {
    navHome: 'หน้าแรก', navExplore: 'สำรวจ', navObjects: 'วัตถุ', navAbout: 'เกี่ยวกับ',
    eyebrow: 'แพลตฟอร์มดาราศาสตร์ยุคใหม่',
    heroLine1: 'สำรวจ', heroAccent: 'จักรวาล', heroLine2: 'จากหน้าจอของคุณ',
    heroSub: 'ข้อมูลท้องฟ้าแบบเรียลไทม์ แคตตาล็อกวัตถุท้องฟ้าลึก และ<span class="kw">แผนที่ดาวแบบโต้ตอบ</span> — ในแดชบอร์ดที่สวยงาม',
    startBtn: 'เริ่มสำรวจ', learnBtn: 'เรียนรู้เพิ่มเติม',
    featLabel: 'ฟีเจอร์', featTitle: 'ทุกสิ่งที่จักรวาลต้องการ',
    featSub: '<span class="kw">เครื่องมือแม่นยำ</span>สำหรับนักดูดาวและนักวิจัย',
    objLabel: 'วัตถุ', objTitle: 'แคตตาล็อกท้องฟ้าลึก',
    objSub: '<span class="kw">วัตถุนับพันในฐานข้อมูลที่เติบโต</span>',
    ctaLabel: 'เข้าร่วม', ctaTitle: 'หอดูดาวของคุณรอคุณอยู่',
    ctaSub: 'สร้าง<span class="kw">บัญชีฟรี</span>และเริ่มสำรวจจักรวาลคืนนี้',
    signIn: 'เข้าสู่ระบบ', register: 'ลงทะเบียน',
    createAcc: 'สร้างบัญชี', welcomeBack: 'ยินดีต้อนรับกลับ',
    loginSub: 'เข้าสู่หอดูดาวของคุณ', joinUs: 'ร่วมกับนักดาราศาสตร์หลายพันคน',
    firstName: 'ชื่อ', lastName: 'นามสกุล', firstPH: 'กาลิเลโอ', lastPH: 'กาลิเลอี',
    emailLabel: 'อีเมล', emailPH: 'you@cosmos.space', passLabel: 'รหัสผ่าน',
    passPH: 'ขั้นต่ำ 8 ตัวอักษร', confirmPass: 'ยืนยันรหัสผ่าน', confirmPH: 'ทำซ้ำรหัสผ่าน',
    tosAgree: 'ฉันยอมรับ', tosAnd: 'และ', forgotPass: 'ลืมรหัสผ่าน?',
    orContinue: 'หรือดำเนินการต่อด้วย', loading: 'กำลังโหลด...',
    successReg: 'ยินดีต้อนรับ!', successLogin: 'ยินดีต้อนรับกลับ!',
    successSub: 'หอดูดาวพร้อมแล้ว สำรวจจักรวาลได้เลย', exploreNow: 'สำรวจเลย',
    tos: 'ข้อกำหนด', privacy: 'นโยบาย', contact: 'ติดต่อ',
    rights: 'สงวนลิขสิทธิ์ทั้งหมด', tosDate: 'มิถุนายน 2026', accept: 'ยอมรับ',
    tos1Title: 'การยอมรับข้อกำหนด',
    tos1Body: 'การเข้าถึงหรือใช้งาน CosmoKlub ("บริการ") ถือว่าคุณได้อ่าน เข้าใจ และยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัวของเรา หากคุณไม่ยอมรับข้อกำหนดทั้งหมด คุณต้องไม่ใช้บริการ เราอาจอัปเดตข้อกำหนดได้ตลอดเวลา การใช้งานต่อเนื่องหลังการเปลี่ยนแปลงถือว่ายอมรับข้อกำหนดที่แก้ไขแล้ว',
    tos2Title: 'คุณสมบัติและความรับผิดชอบของบัญชี',
    tos2Body: 'คุณต้องมีอายุอย่างน้อย 13 ปีเพื่อสร้างบัญชี คุณรับผิดชอบในการรักษาความลับของข้อมูลรับรองและกิจกรรมทั้งหมดที่เกิดขึ้นในบัญชีของคุณ แจ้งเราทันทีที่ hello@cosmoklub.space หากสงสัยว่ามีการเข้าถึงโดยไม่ได้รับอนุญาต',
    tos3Title: 'การใช้งานที่ได้รับอนุญาต',
    tos3Body: 'CosmoKlub มอบสิทธิ์ใช้งานส่วนบุคคล ไม่ผูกขาด และไม่สามารถโอนได้เพื่อใช้บริการเพื่อวัตถุประสงค์ทางดาราศาสตร์ การวิจัย การศึกษา และการสนทนาในชุมชนที่ถูกกฎหมาย ห้ามใช้บริการเพื่อละเมิดกฎหมาย ละเมิดสิทธิ์ของบุคคลที่สาม แจกจ่ายมัลแวร์ หรือรบกวนแพลตฟอร์ม',
    tos4Title: 'แชทชุมชนและการส่งข้อความ',
    tos4Body: 'ฟีเจอร์แชทและการส่งข้อความมีไว้เพื่อส่งเสริมชุมชนดาราศาสตร์ที่น่าเคารพ ห้ามส่งสแปม คำพูดที่แสดงความเกลียดชัง การคุกคาม การข่มขู่ เนื้อหาทางเพศ หรือเนื้อหาที่เลือกปฏิบัติบนพื้นฐานของเชื้อชาติ ศาสนา เพศ รสนิยมทางเพศ ความพิการ หรือสัญชาติ CosmoKlub ขอสงวนสิทธิ์ในการลบเนื้อหาหรือระงับบัญชีโดยไม่แจ้งล่วงหน้า',
    tos5Title: 'เนื้อหาที่ผู้ใช้สร้างและการโพสต์',
    tos5Body: 'คุณยังคงเป็นเจ้าของเนื้อหาที่คุณโพสต์ (การสังเกต รูปภาพ ความคิดเห็น) การโพสต์ถือว่าคุณมอบสิทธิ์ใช้งานทั่วโลกแบบปลอดค่าลิขสิทธิ์แก่ CosmoKlub เพื่อแสดงและแจกจ่ายเนื้อหานั้นภายในบริการ คุณรับรองว่าคุณมีสิทธิ์ที่จำเป็นทั้งหมดสำหรับเนื้อหาที่ส่ง',
    tos6Title: 'ฟีเจอร์ AI และเครื่องมืออัตโนมัติ',
    tos6Body: 'CosmoKlub มีฟีเจอร์ AI รวมถึง Pensia (ผู้ช่วย AI ดาราศาสตร์) และการจดจำวัตถุท้องฟ้าด้วย AI เครื่องมือเหล่านี้ให้บริการตามสภาพและอาจให้ผลลัพธ์ที่ไม่ถูกต้อง อย่าพึ่งพาผลลัพธ์ AI เพียงอย่างเดียวสำหรับการตัดสินใจสำคัญ เนื้อหาที่ส่งให้เครื่องมือ AI อาจถูกประมวลผลโดยผู้ให้บริการบุคคลที่สาม',
    tos7Title: 'ข้อมูล ความเป็นส่วนตัว และคุกกี้',
    tos7Body: 'เราเก็บรวบรวมเฉพาะข้อมูลที่จำเป็นสำหรับการดำเนินงานและการปรับแต่งบริการ ข้อมูลส่วนบุคคลของคุณจะไม่ถูกขายให้กับบุคคลที่สาม เราใช้คุกกี้สำหรับการตรวจสอบสิทธิ์และการวิเคราะห์ ผู้ใช้ใน EU/EEA มีสิทธิ์เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลโดยติดต่อ hello@cosmoklub.space',
    tos8Title: 'ทรัพย์สินทางปัญญา',
    tos8Body: 'เนื้อหาต้นฉบับ ซอฟต์แวร์ ฐานข้อมูล โมเดล 3D การออกแบบ และเครื่องมือทั้งหมดในบริการเป็นทรัพย์สินทางปัญญาของ CosmoKlub และผู้ให้สิทธิ์ ห้ามคัดลอก แจกจ่าย หรือสร้างผลงานดัดแปลงโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรล่วงหน้า',
    tos9Title: 'การจำกัดความรับผิดและข้อสงวน',
    tos9Body: 'บริการและข้อมูลดาราศาสตร์ทั้งหมดให้บริการ "ตามสภาพ" โดยไม่มีการรับประกันใดๆ ทั้งโดยชัดแจ้งหรือโดยนัย รวมถึงความถูกต้อง ความสมบูรณ์ หรือความเหมาะสมสำหรับวัตถุประสงค์เฉพาะ ในขอบเขตสูงสุดที่กฎหมายอนุญาต CosmoKlub จะไม่รับผิดชอบต่อความเสียหายทางอ้อม โดยบังเอิญ หรือผลเสียหายใดๆ',
    tos10Title: 'การยุติและกฎหมายที่ใช้บังคับ',
    tos10Body: 'CosmoKlub ขอสงวนสิทธิ์ในการระงับหรือยุติบัญชีของคุณได้ตลอดเวลาหากละเมิดข้อกำหนดเหล่านี้ คุณสามารถลบบัญชีได้ตลอดเวลาผ่านการตั้งค่าบัญชี ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายของเขตอำนาจศาลที่ CosmoKlub ดำเนินงาน หากข้อกำหนดใดไม่สามารถบังคับใช้ได้ ข้อกำหนดที่เหลือยังคงมีผลบังคับใช้เต็มรูปแบบ',
    errFirst: 'ต้องระบุชื่อ', errLast: 'ต้องระบุนามสกุล',
    errEmail: 'ต้องใช้อีเมลที่ถูกต้อง', errPass: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว',
    errConfirm: 'รหัสผ่านไม่ตรงกัน', errTos: 'ต้องยอมรับข้อกำหนด',
    toastReg: 'สร้างบัญชีแล้ว ยินดีต้อนรับ', toastLogin: 'เข้าสู่ระบบสำเร็จ'
  }
};

// ---------- Vue App ----------
createApp({
  data() {
    return {
      modal: null,
      authTab: 'register',
      langOpen: false,
      pensiaOpen: false,
      pensiaLoading: false,
      pensiaMsg: '',
      pensiaHeadline: '',
      pensiaCloseTimer: null,
      _pensiaFetched: false,
      pensiaPos: { x: 0, y: 0 },
      pensiaDragging: false,
      pensiaBubbleFlip: { below: false, left: false },
      currentLang: { code: 'EN', name: 'English', flag: '🇬🇧' },
      langs: [
        { code: 'EN', name: 'English', flag: '🇬🇧' },
        { code: 'ES', name: 'Español', flag: '🇪🇸' },
        { code: 'FR', name: 'Français', flag: '🇫🇷' },
        { code: 'JA', name: '日本語', flag: '🇯🇵' },
        { code: 'TH', name: 'ภาษาไทย', flag: '🇹🇭' }
      ],
      form: { firstName: '', lastName: '', email: '', password: '', confirm: '', tos: false },
      errors: {},
      loading: false,
      success: false,
      toast: null
    };
  },
  computed: {
    t() { return translations[this.currentLang.code] || translations.EN; },
    features() {
      return [
        { svg: SVGS.telescope, title: 'Interactive Sky Map', desc: 'Real-time star map synchronized with your location, time, and viewing conditions.' },
        { svg: SVGS.satellite, title: 'Observation Planner', desc: 'Find the best objects visible tonight based on your telescope, location, and weather.' },
        { svg: SVGS.layers, title: 'Deep-Sky Catalogue', desc: 'Explore Messier, NGC, IC, planets, comets, asteroids, and thousands of celestial objects.' },
        { svg: SVGS.chart, title: 'Observing Conditions', desc: 'Moon phase, cloud cover, seeing, transparency, and light pollution forecasts.' },
        { svg: SVGS.cpu, title: 'AI Object Recognition', desc: 'Upload astrophotos and our model identifies every star, galaxy, and nebula automatically.' },
        { svg: SVGS.book, title: 'Observation Logbook', desc: 'Track observations, equipment used, sketches, notes, and achievements.' }
      ];
    },
    objects() {
      return [
        { svg: OBJ_SVGS.galaxy, type: 'Galaxy', name: 'Andromeda (M31)', desc: 'Nearest major galaxy, 2.5M light-years away.' },
        { svg: OBJ_SVGS.nebula, type: 'Nebula', name: 'Orion Nebula (M42)', desc: 'Active stellar nursery in the sword of Orion.' },
        { svg: OBJ_SVGS.cluster, type: 'Cluster', name: 'Pleiades (M45)', desc: 'Seven Sisters open cluster, visible to the naked eye.' },
        { svg: OBJ_SVGS.ring, type: 'Nebula', name: 'Ring Nebula (M57)', desc: 'Classic planetary nebula in Lyra.' },
        { svg: OBJ_SVGS.supernova, type: 'Supernova', name: 'Crab Nebula (M1)', desc: 'Remnant of SN 1054, powered by a pulsar.' },
        { svg: OBJ_SVGS.whirlpool, type: 'Galaxy', name: 'Whirlpool (M51)', desc: 'Interacting galaxy pair in Canes Venatici.' },
        { svg: OBJ_SVGS.globular, type: 'Cluster', name: 'Hercules Cluster (M13)', desc: 'Brightest globular cluster in the northern sky.' },
        { svg: OBJ_SVGS.lagoon, type: 'Nebula', name: 'Lagoon Nebula (M8)', desc: 'Emission nebula and open cluster in Sagittarius.' }
      ];
    }
  },
  methods: {
    setLang(l) { this.currentLang = l; this.langOpen = false; },
    // --- Pensia drag-to-move ---
    onPensiaPointerDown(e) {
      e.currentTarget.setPointerCapture(e.pointerId);
      this._pensiaDrag = {
        startX: e.clientX,
        startY: e.clientY,
        baseX: this.pensiaPos.x,
        baseY: this.pensiaPos.y,
        moved: false
      };
    },
    onPensiaPointerMove(e) {
      const d = this._pensiaDrag;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!d.moved && Math.hypot(dx, dy) > 4) {
        d.moved = true;
        this.pensiaDragging = true;
        // dragging takes priority over the chat bubble — close it now
        // even if its auto-dismiss timer hasn't run out yet
        clearTimeout(this.pensiaCloseTimer);
        this.pensiaOpen = false;
      }
      if (d.moved) {
        const bounds = this.pensiaBounds();
        this.pensiaPos = {
          x: Math.min(Math.max(8, d.baseX + dx), bounds.maxX),
          y: Math.min(Math.max(8, d.baseY + dy), bounds.maxY)
        };
      }
    },
    onPensiaPointerUp() {
      const d = this._pensiaDrag;
      if (!d) return;
      this._pensiaDrag = null;
      this.pensiaDragging = false;
      if (!d.moved) {
        // no real movement happened — treat it as a click/tap
        this.pensiaClick();
      }
      // note: by design, her position is NOT remembered between visits —
      // she resets to her default spot next to the Features heading every load
    },
    pensiaBounds() {
      const el = this.$refs.pensiaWrap;
      const w = el ? el.offsetWidth : 160;
      const h = el ? el.offsetHeight : 160;
      return {
        maxX: Math.max(8, document.documentElement.clientWidth - w - 8),
        maxY: Math.max(8, document.documentElement.scrollHeight - h - 8)
      };
    },
    clampPensiaPos() {
      const bounds = this.pensiaBounds();
      this.pensiaPos = {
        x: Math.min(Math.max(8, this.pensiaPos.x), bounds.maxX),
        y: Math.min(Math.max(8, this.pensiaPos.y), bounds.maxY)
      };
    },
    // Pensia's default home: to the right of "Everything the cosmos
    // demands" (the Features heading), same spot the original design
    // had her in. Re-run on load/resize/font-swap so she always lands
    // here and never gets stuck wherever the last layout pass left her.
    resetPensiaToDefault() {
      const headerEl = document.querySelector('.features-header-row');
      const el = this.$refs.pensiaWrap;
      if (!headerEl || !el || !el.offsetWidth) return;
      const rect = headerEl.getBoundingClientRect();
      if (!rect.width && !rect.height) return; // section not laid out yet
      const w = el.offsetWidth, h = el.offsetHeight;
      const bounds = this.pensiaBounds();
      const x = Math.round(rect.right + window.scrollX - w);
      const y = Math.round(rect.top + window.scrollY + (rect.height - h) / 2);
      this.pensiaPos = {
        x: Math.min(Math.max(8, x), bounds.maxX),
        y: Math.max(8, y)
      };
    },
    async pensiaClick() {
      clearTimeout(this.pensiaCloseTimer);
      if (!this.pensiaOpen) {
        // about to open — snapshot her current screen position so the
        // bubble can flip to whichever side keeps it fully visible
        const el = this.$refs.pensiaWrap;
        if (el) {
          const r = el.getBoundingClientRect();
          this.pensiaBubbleFlip = { below: r.top < 170, left: r.left < 200 };
        }
      }
      this.pensiaOpen = !this.pensiaOpen;
      if (!this.pensiaOpen) return;
      this.pensiaLoading = true;
      this.pensiaMsg = '';
      this.pensiaHeadline = '';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        const apodRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=TSTiFv4spdqyeg2tijUw3GwScNh2JA596I0qSnKa&count=3`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!apodRes.ok) throw new Error(`NASA APOD request failed (${apodRes.status})`);
        const apodData = await apodRes.json();
        const pick = apodData[Math.floor(Math.random() * apodData.length)];
        const { headline, opinion } = this.pensiaVoice(pick.title, pick.explanation || '');
        this.pensiaHeadline = headline;
        this.pensiaMsg = opinion;
      } catch (e) {
        const f = this.pensiaFallback();
        this.pensiaHeadline = f.h;
        this.pensiaMsg = f.m;
      }
      this.pensiaLoading = false;
      this.pensiaCloseTimer = setTimeout(() => {
        this.pensiaOpen = false;
      }, 8000);
    },
    pensiaVoice(title, explanation) {
      const openers = [
        "Ooh, today's pick:", "Just waddled past this one:", "My favourite today:",
        "This stopped me mid-slide:", "Look what NASA found:", "Beak-drop moment:",
        "I've been staring at this all morning:", "Fresh off the telescope:",
      ];
      const reactions = [
        "I can't stop thinking about it!", "My flippers are tingling!",
        "I'm adding this to my logbook immediately.", "Ten out of ten, no notes.",
        "This is exactly why I love this job.", "I did a little happy waddle.",
        "Filed under: absolutely wild.", "Honestly, my best find all week.",
      ];
      const emojis = ['🌌', '✨', '🪐', '☄️', '🔭', '🌠', '🛰️', '🌙', '⭐'];

      const opener   = openers[Math.floor(Math.random() * openers.length)];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      const emoji    = emojis[Math.floor(Math.random() * emojis.length)];

      const firstSentence = (explanation.match(/^.*?[.!?](?=\s|$)/) || [explanation])[0] || '';
      const snippet    = firstSentence.length > 95 ? firstSentence.slice(0, 95).trim() + '…' : firstSentence;
      const shortTitle = title.length > 30 ? title.slice(0, 30).trim() + '…' : title;

      return {
        headline: `${emoji} ${shortTitle}`,
        opinion: `${opener} ${snippet} ${reaction}`.trim(),
      };
    },
    pensiaFallback() {
      const facts = [
        { h: '🌌 Galaxy count!', m: 'There are over 2 trillion galaxies in the observable universe. That\'s more galaxies than grains of sand on all Earth\'s beaches!' },
        { h: '☀️ Sun size!', m: 'About 1.3 million Earths could fit inside the Sun — and it\'s considered a medium-sized star. Wild, right?!' },
        { h: '🪐 Saturn floats!', m: 'Saturn is so light for its size it would actually float on water. I want to see that swimming pool!' },
        { h: '⭐ Old star light!', m: 'The light from the nearest star takes 4.2 years to reach us. We\'re literally seeing the past every night!' },
        { h: '🌕 Moon footprints!', m: 'Footprints left on the Moon will likely still be there in a million years — no wind or rain to wipe them away.' },
        { h: '🚀 Voyager 1!', m: 'Voyager 1 is over 24 billion km from home and still phoning in after almost 50 years in space. Respect.' },
        { h: '🌑 Venus day!', m: 'A day on Venus is longer than its year — it spins so slowly that sunrise to sunrise takes 117 Earth days!' },
        { h: '💫 Neutron stars!', m: 'A neutron star is so dense a teaspoon of it would weigh about a billion tons. My scale would not survive that.' },
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    },
    openModal(m) { this.modal = m; this.authTab = m === 'login' ? 'login' : 'register'; this.clearForm(); this.success = false; document.body.style.overflow = 'hidden'; },
    closeModal() { this.modal = null; this.success = false; document.body.style.overflow = ''; },
    clearForm() { this.form = { firstName: '', lastName: '', email: '', password: '', confirm: '', tos: false }; this.errors = {}; },
    validateRegister() {
      const e = {};
      const t = this.t;
      if (!this.form.firstName.trim()) e.firstName = t.errFirst;
      if (!this.form.lastName.trim()) e.lastName = t.errLast;
      if (!this.form.email.includes('@')) e.email = t.errEmail;
      if (this.form.password.length < 8) e.password = t.errPass;
      if (this.form.password !== this.form.confirm) e.confirm = t.errConfirm;
      if (!this.form.tos) e.tos = t.errTos;
      this.errors = e;
      return !Object.keys(e).length;
    },
    validateLogin() {
      const e = {};
      const t = this.t;
      if (!this.form.email.includes('@')) e.email = t.errEmail;
      if (!this.form.password) e.password = t.errPass;
      this.errors = e;
      return !Object.keys(e).length;
    },
    async submitRegister() { if (!this.validateRegister()) return; this.loading = true; await new Promise(r => setTimeout(r, 1100)); this.loading = false; this.success = true; this.showToast(this.t.toastReg); },
    async submitLogin() { if (!this.validateLogin()) return; this.loading = true; await new Promise(r => setTimeout(r, 900)); this.loading = false; this.success = true; this.showToast(this.t.toastLogin); },
    showToast(msg) { this.toast = msg; setTimeout(() => { this.toast = null; }, 3400); }
  },
  mounted() {
    // Wait for web fonts + a real layout/paint pass before placing Pensia.
    // Measuring against the page before Inter has swapped in (or before
    // images/canvas above the fold have settled their height) gives a
    // stale rect and she ends up stranded near the top-left corner.
    const placePensia = () => {
      this.$nextTick(() => {
        requestAnimationFrame(() => this.resetPensiaToDefault());
      });
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(placePensia);
    } else {
      placePensia();
    }
    // Safety net: run again shortly after load in case anything above
    // the Features section (hero art, stat badges, planet canvas) shifts
    // height after fonts/images finish.
    window.addEventListener('load', placePensia);
    setTimeout(placePensia, 600);
    // On resize, re-anchor to the heading rather than just clamping —
    // otherwise resizing can leave her drifted away from her home spot.
    // Skip while she's being dragged or her bubble is open so we don't
    // yank her out from under the user mid-interaction.
    window.addEventListener('resize', () => {
      if (this.pensiaDragging || this.pensiaOpen) {
        this.clampPensiaPos();
      } else {
        this.resetPensiaToDefault();
      }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.lang-wrap')) this.langOpen = false; });
    const nav = document.querySelector('nav');
    const featuresSection = document.getElementById('features');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      // scrolled: subtle shadow/border on any scroll
      if (y > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
      // compact: squeeze nav when features section reaches the top
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        const inFeatures = rect.top <= nav.offsetHeight + 20;
        if (inFeatures) nav.classList.add('compact'); else nav.classList.remove('compact');
      }
    }, { passive: true });
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const resizeStars = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.2,
        o: Math.random() * 0.75 + 0.1,
        s: Math.random() * 0.0025 + 0.001,
        t: Math.random() * Math.PI * 2
      }));
    };
    resizeStars();
    window.addEventListener('resize', resizeStars);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.t += s.s;
        const a = s.o * (0.5 + 0.5 * Math.sin(s.t));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,168,255,${a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }
}).mount('#app');
