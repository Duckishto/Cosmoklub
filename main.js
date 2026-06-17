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
    heroSub: 'Discover celestial objects, plan observations, analyze astronomical data, and connect with the global astronomy community.',
    startBtn: 'Start Exploring', learnBtn: 'Learn more',
    featLabel: 'Features', featTitle: 'Everything the cosmos demands',
    featSub: 'Precision tools for amateur observers and professional researchers alike.',
    objLabel: 'Objects', objTitle: 'Deep-sky catalogue',
    objSub: 'Thousands of catalogued objects from our expanding database.',
    ctaLabel: 'Join CosmoKlub', ctaTitle: 'Your observatory awaits',
    ctaSub: 'Create your free account and start mapping the cosmos tonight.',
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
    tos1Body: 'By accessing CosmoKlub, you agree to be bound by these Terms of Service.',
    tos2Title: 'Use of Service',
    tos2Body: 'CosmoKlub grants you a personal, non-transferable licence for astronomical observation and research.',
    tos3Title: 'Account Responsibility',
    tos3Body: 'You are responsible for maintaining the confidentiality of your account credentials.',
    tos4Title: 'Data and Privacy',
    tos4Body: 'We collect only the data necessary to operate the service. Your personal information is never sold.',
    tos5Title: 'Intellectual Property',
    tos5Body: 'All original content and tools are the property of CosmoKlub and its licensors.',
    tos6Title: 'Limitation of Liability',
    tos6Body: 'CosmoKlub provides astronomical data as-is without warranties of accuracy.',
    errFirst: 'First name is required', errLast: 'Last name is required',
    errEmail: 'A valid email is required', errPass: 'Password must be at least 8 characters',
    errConfirm: 'Passwords do not match', errTos: 'You must accept the Terms of Service',
    toastReg: 'Account created. Welcome to CosmoKlub.', toastLogin: 'Signed in successfully.'
  },
  ES: {
    navHome: 'Inicio', navExplore: 'Explorar', navObjects: 'Objetos', navAbout: 'Acerca de',
    eyebrow: 'Plataforma de astronomia de nueva generacion',
    heroLine1: 'Navega por el', heroAccent: 'Universo', heroLine2: 'desde tu pantalla.',
    heroSub: 'Datos celestes en tiempo real, catalogos y mapas interactivos — todo en un panel oscuro y elegante.',
    startBtn: 'Comenzar', learnBtn: 'Mas info',
    featLabel: 'Funciones', featTitle: 'Todo lo que el cosmos exige.',
    featSub: 'Herramientas de precision para observadores e investigadores.',
    objLabel: 'Objetos', objTitle: 'Catalogo de cielo profundo.',
    objSub: 'Miles de objetos catalogados en nuestra base de datos.',
    ctaLabel: 'Unete', ctaTitle: 'Tu observatorio te espera.',
    ctaSub: 'Crea tu cuenta gratuita y empieza a mapear el cosmos esta noche.',
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
    tos1Title: 'Aceptacion', tos1Body: 'Al acceder a CosmoKlub, aceptas estos Terminos.',
    tos2Title: 'Uso', tos2Body: 'Licencia personal para fines astronomicos.',
    tos3Title: 'Cuenta', tos3Body: 'Eres responsable de tus credenciales.',
    tos4Title: 'Privacidad', tos4Body: 'Solo recopilamos datos necesarios.',
    tos5Title: 'Propiedad intelectual', tos5Body: 'Todo el contenido es propiedad de CosmoKlub.',
    tos6Title: 'Limitacion', tos6Body: 'Datos proporcionados sin garantia de exactitud.',
    errFirst: 'El nombre es obligatorio', errLast: 'El apellido es obligatorio',
    errEmail: 'Correo valido requerido', errPass: 'Minimo 8 caracteres',
    errConfirm: 'Las contrasenlas no coinciden', errTos: 'Debes aceptar los Terminos',
    toastReg: 'Cuenta creada.', toastLogin: 'Sesion iniciada.'
  },
  FR: {
    navHome: 'Accueil', navExplore: 'Explorer', navObjects: 'Objets', navAbout: 'A propos',
    eyebrow: 'Plateforme astronomique nouvelle generation',
    heroLine1: "Naviguez dans l'", heroAccent: 'Univers', heroLine2: 'depuis votre ecran.',
    heroSub: "Donnees celestes en temps reel, catalogues et cartes interactives — dans un tableau de bord sombre et elegant.",
    startBtn: 'Commencer', learnBtn: 'En savoir plus',
    featLabel: 'Fonctionnalites', featTitle: 'Tout ce que le cosmos exige.',
    featSub: "Outils pour observateurs et chercheurs.",
    objLabel: 'Objets', objTitle: 'Catalogue du ciel profond.',
    objSub: "Des milliers d'objets catalogues.",
    ctaLabel: 'Rejoindre', ctaTitle: 'Votre observatoire vous attend.',
    ctaSub: 'Creez votre compte gratuit ce soir.',
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
    tos1Title: 'Acceptation', tos1Body: "En accedant a CosmoKlub, vous acceptez ces conditions.",
    tos2Title: 'Utilisation', tos2Body: 'Licence personnelle pour usage astronomique.',
    tos3Title: 'Compte', tos3Body: 'Vous etes responsable de vos identifiants.',
    tos4Title: 'Donnees', tos4Body: 'Nous collectons uniquement les donnees necessaires.',
    tos5Title: 'Propriete intellectuelle', tos5Body: "Tout le contenu appartient a CosmoKlub.",
    tos6Title: 'Responsabilite', tos6Body: "Donnees fournies sans garantie d'exactitude.",
    errFirst: 'Le prenom est obligatoire', errLast: 'Le nom est obligatoire',
    errEmail: 'E-mail valide requis', errPass: 'Minimum 8 caracteres',
    errConfirm: 'Les mots de passe ne correspondent pas', errTos: "Vous devez accepter les conditions",
    toastReg: 'Compte cree.', toastLogin: 'Connexion reussie.'
  },
  JA: {
    navHome: 'ホーム', navExplore: '探索', navObjects: '天体', navAbout: '概要',
    eyebrow: '次世代天文学プラットフォーム',
    heroLine1: '宇宙を', heroAccent: '探索', heroLine2: 'あなたの画面から。',
    heroSub: 'リアルタイム天体データ、深宇宙カタログ、インタラクティブ星図 — 美しいダッシュボードで。',
    startBtn: '探索を始める', learnBtn: '詳細を見る',
    featLabel: '機能', featTitle: '宇宙が求めるすべて。',
    featSub: 'アマチュアからプロまで対応した精密ツール。',
    objLabel: '天体', objTitle: '深宇宙カタログ。',
    objSub: '数千の天体をカタログ化。',
    ctaLabel: '参加', ctaTitle: 'あなたの天文台が待っています。',
    ctaSub: '無料アカウントを作成して今夜から宇宙を探索。',
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
    tos1Title: '同意', tos1Body: 'CosmoKlubにアクセスすることで利用規約に同意します。',
    tos2Title: '使用', tos2Body: '天文学的目的での個人ライセンスを付与します。',
    tos3Title: 'アカウント', tos3Body: '認証情報の機密性を維持する責任があります。',
    tos4Title: 'データ', tos4Body: '必要なデータのみを収集します。',
    tos5Title: '知的財産', tos5Body: 'すべてのコンテンツはCosmoKlubの財産です。',
    tos6Title: '責任', tos6Body: 'データは保証なしに提供されます。',
    errFirst: '名前は必須です', errLast: '姓は必須です',
    errEmail: '有効なメールが必要です', errPass: '8文字以上必要です',
    errConfirm: 'パスワードが一致しません', errTos: '利用規約に同意が必要です',
    toastReg: 'アカウント作成完了。', toastLogin: 'ログイン成功。'
  },
  TH: {
    navHome: 'หน้าแรก', navExplore: 'สำรวจ', navObjects: 'วัตถุ', navAbout: 'เกี่ยวกับ',
    eyebrow: 'แพลตฟอร์มดาราศาสตร์ยุคใหม่',
    heroLine1: 'สำรวจ', heroAccent: 'จักรวาล', heroLine2: 'จากหน้าจอของคุณ',
    heroSub: 'ข้อมูลท้องฟ้าแบบเรียลไทม์ แคตตาล็อกวัตถุท้องฟ้าลึก และแผนที่ดาวแบบโต้ตอบ — ในแดชบอร์ดที่สวยงาม',
    startBtn: 'เริ่มสำรวจ', learnBtn: 'เรียนรู้เพิ่มเติม',
    featLabel: 'ฟีเจอร์', featTitle: 'ทุกสิ่งที่จักรวาลต้องการ',
    featSub: 'เครื่องมือแม่นยำสำหรับนักดูดาวและนักวิจัย',
    objLabel: 'วัตถุ', objTitle: 'แคตตาล็อกท้องฟ้าลึก',
    objSub: 'วัตถุนับพันในฐานข้อมูลที่เติบโต',
    ctaLabel: 'เข้าร่วม', ctaTitle: 'หอดูดาวของคุณรอคุณอยู่',
    ctaSub: 'สร้างบัญชีฟรีและเริ่มสำรวจจักรวาลคืนนี้',
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
    tos1Title: 'การยอมรับ', tos1Body: 'การใช้ CosmoKlub แสดงว่าคุณยอมรับข้อกำหนดเหล่านี้',
    tos2Title: 'การใช้บริการ', tos2Body: 'ใบอนุญาตส่วนบุคคลสำหรับวัตถุประสงค์ทางดาราศาสตร์',
    tos3Title: 'ความรับผิดชอบ', tos3Body: 'คุณรับผิดชอบในการรักษาความลับของข้อมูล',
    tos4Title: 'ข้อมูล', tos4Body: 'เก็บรวบรวมเฉพาะข้อมูลที่จำเป็น',
    tos5Title: 'ทรัพย์สินทางปัญญา', tos5Body: 'เนื้อหาทั้งหมดเป็นทรัพย์สินของ CosmoKlub',
    tos6Title: 'การจำกัดความรับผิด', tos6Body: 'ข้อมูลให้บริการโดยไม่มีการรับประกัน',
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
      _pensiaFetched: false,
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
    async pensiaClick() {
      this.pensiaOpen = !this.pensiaOpen;
      if (!this.pensiaOpen) return;
      this.pensiaLoading = true;
      this.pensiaMsg = '';
      this.pensiaHeadline = '';
      try {
        const apodRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=TSTiFv4spdqyeg2tijUw3GwScNh2JA596I0qSnKa&count=3`);
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
    openModal(m) { this.modal = m; this.authTab = m === 'login' ? 'login' : 'register'; this.clearForm(); this.success = false; },
    closeModal() { this.modal = null; this.success = false; },
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
    document.addEventListener('click', e => { if (!e.target.closest('.lang-wrap')) this.langOpen = false; });
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
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
  FR: {
    navHome: 'Accueil', navExplore: 'Explorer', navObjects: 'Objets', navAbout: 'A propos',
    eyebrow: 'Plateforme astronomique nouvelle generation',
    heroLine1: "Naviguez dans l'", heroAccent: 'Univers', heroLine2: 'depuis votre ecran.',
    heroSub: "Donnees celestes en temps reel, catalogues et cartes interactives — dans un tableau de bord sombre et elegant.",
    startBtn: 'Commencer', learnBtn: 'En savoir plus',
    featLabel: 'Fonctionnalites', featTitle: 'Tout ce que le cosmos exige.',
    featSub: "Outils pour observateurs et chercheurs.",
    objLabel: 'Objets', objTitle: 'Catalogue du ciel profond.',
    objSub: "Des milliers d'objets catalogues.",
    ctaLabel: 'Rejoindre', ctaTitle: 'Votre observatoire vous attend.',
    ctaSub: 'Creez votre compte gratuit ce soir.',
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
    tos1Title: 'Acceptation', tos1Body: "En accedant a CosmoKlub, vous acceptez ces conditions.",
    tos2Title: 'Utilisation', tos2Body: 'Licence personnelle pour usage astronomique.',
    tos3Title: 'Compte', tos3Body: 'Vous etes responsable de vos identifiants.',
    tos4Title: 'Donnees', tos4Body: 'Nous collectons uniquement les donnees necessaires.',
    tos5Title: 'Propriete intellectuelle', tos5Body: "Tout le contenu appartient a CosmoKlub.",
    tos6Title: 'Responsabilite', tos6Body: "Donnees fournies sans garantie d'exactitude.",
    errFirst: 'Le prenom est obligatoire', errLast: 'Le nom est obligatoire',
    errEmail: 'E-mail valide requis', errPass: 'Minimum 8 caracteres',
    errConfirm: 'Les mots de passe ne correspondent pas', errTos: "Vous devez accepter les conditions",
    toastReg: 'Compte cree.', toastLogin: 'Connexion reussie.'
  },
  JA: {
    navHome: 'ホーム', navExplore: '探索', navObjects: '天体', navAbout: '概要',
    eyebrow: '次世代天文学プラットフォーム',
    heroLine1: '宇宙を', heroAccent: '探索', heroLine2: 'あなたの画面から。',
    heroSub: 'リアルタイム天体データ、深宇宙カタログ、インタラクティブ星図 — 美しいダッシュボードで。',
    startBtn: '探索を始める', learnBtn: '詳細を見る',
    featLabel: '機能', featTitle: '宇宙が求めるすべて。',
    featSub: 'アマチュアからプロまで対応した精密ツール。',
    objLabel: '天体', objTitle: '深宇宙カタログ。',
    objSub: '数千の天体をカタログ化。',
    ctaLabel: '参加', ctaTitle: 'あなたの天文台が待っています。',
    ctaSub: '無料アカウントを作成して今夜から宇宙を探索。',
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
    tos1Title: '同意', tos1Body: 'CosmoKlubにアクセスすることで利用規約に同意します。',
    tos2Title: '使用', tos2Body: '天文学的目的での個人ライセンスを付与します。',
    tos3Title: 'アカウント', tos3Body: '認証情報の機密性を維持する責任があります。',
    tos4Title: 'データ', tos4Body: '必要なデータのみを収集します。',
    tos5Title: '知的財産', tos5Body: 'すべてのコンテンツはCosmoKlubの財産です。',
    tos6Title: '責任', tos6Body: 'データは保証なしに提供されます。',
    errFirst: '名前は必須です', errLast: '姓は必須です',
    errEmail: '有効なメールが必要です', errPass: '8文字以上必要です',
    errConfirm: 'パスワードが一致しません', errTos: '利用規約に同意が必要です',
    toastReg: 'アカウント作成完了。', toastLogin: 'ログイン成功。'
  },
  TH: {
    navHome: 'หน้าแรก', navExplore: 'สำรวจ', navObjects: 'วัตถุ', navAbout: 'เกี่ยวกับ',
    eyebrow: 'แพลตฟอร์มดาราศาสตร์ยุคใหม่',
    heroLine1: 'สำรวจ', heroAccent: 'จักรวาล', heroLine2: 'จากหน้าจอของคุณ',
    heroSub: 'ข้อมูลท้องฟ้าแบบเรียลไทม์ แคตตาล็อกวัตถุท้องฟ้าลึก และแผนที่ดาวแบบโต้ตอบ — ในแดชบอร์ดที่สวยงาม',
    startBtn: 'เริ่มสำรวจ', learnBtn: 'เรียนรู้เพิ่มเติม',
    featLabel: 'ฟีเจอร์', featTitle: 'ทุกสิ่งที่จักรวาลต้องการ',
    featSub: 'เครื่องมือแม่นยำสำหรับนักดูดาวและนักวิจัย',
    objLabel: 'วัตถุ', objTitle: 'แคตตาล็อกท้องฟ้าลึก',
    objSub: 'วัตถุนับพันในฐานข้อมูลที่เติบโต',
    ctaLabel: 'เข้าร่วม', ctaTitle: 'หอดูดาวของคุณรอคุณอยู่',
    ctaSub: 'สร้างบัญชีฟรีและเริ่มสำรวจจักรวาลคืนนี้',
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
    tos1Title: 'การยอมรับ', tos1Body: 'การใช้ CosmoKlub แสดงว่าคุณยอมรับข้อกำหนดเหล่านี้',
    tos2Title: 'การใช้บริการ', tos2Body: 'ใบอนุญาตส่วนบุคคลสำหรับวัตถุประสงค์ทางดาราศาสตร์',
    tos3Title: 'ความรับผิดชอบ', tos3Body: 'คุณรับผิดชอบในการรักษาความลับของข้อมูล',
    tos4Title: 'ข้อมูล', tos4Body: 'เก็บรวบรวมเฉพาะข้อมูลที่จำเป็น',
    tos5Title: 'ทรัพย์สินทางปัญญา', tos5Body: 'เนื้อหาทั้งหมดเป็นทรัพย์สินของ CosmoKlub',
    tos6Title: 'การจำกัดความรับผิด', tos6Body: 'ข้อมูลให้บริการโดยไม่มีการรับประกัน',
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
      _pensiaFetched: false,
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
    async pensiaClick() {
      this.pensiaOpen = !this.pensiaOpen;
      if (!this.pensiaOpen) return;
      // Always re-fetch on every open for fresh content
      this.pensiaLoading = true;
      this.pensiaMsg = '';
      this.pensiaHeadline = '';
      try {
        const apodRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=TSTiFv4spdqyeg2tijUw3GwScNh2JA596I0qSnKa&count=3`);
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
    },
    // Pensia's personality, generated entirely on-device — no Claude API,
    // no other AI/LLM API, no network call beyond the NASA fetch above.
    // Randomised opener + reaction + emoji templates wrapped around the
    // real NASA headline mean she rarely "says" the same thing twice.
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
    // Used only if the NASA fetch itself fails (offline, rate-limited, etc).
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
    openModal(m) { this.modal = m; this.authTab = m === 'login' ? 'login' : 'register'; this.clearForm(); this.success = false; },
    closeModal() { this.modal = null; this.success = false; },
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
    document.addEventListener('click', e => { if (!e.target.closest('.lang-wrap')) this.langOpen = false; });
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
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
}).mount('#app');  FR: {
    navHome: 'Accueil', navExplore: 'Explorer', navObjects: 'Objets', navAbout: 'A propos',
    eyebrow: 'Plateforme astronomique nouvelle generation',
    heroLine1: "Naviguez dans l'", heroAccent: 'Univers', heroLine2: 'depuis votre ecran.',
    heroSub: "Donnees celestes en temps reel, catalogues et cartes interactives — dans un tableau de bord sombre et elegant.",
    startBtn: 'Commencer', learnBtn: 'En savoir plus',
    featLabel: 'Fonctionnalites', featTitle: 'Tout ce que le cosmos exige.',
    featSub: "Outils pour observateurs et chercheurs.",
    objLabel: 'Objets', objTitle: 'Catalogue du ciel profond.',
    objSub: "Des milliers d'objets catalogues.",
    ctaLabel: 'Rejoindre', ctaTitle: 'Votre observatoire vous attend.',
    ctaSub: 'Creez votre compte gratuit ce soir.',
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
    tos1Title: 'Acceptation', tos1Body: "En accedant a CosmoKlub, vous acceptez ces conditions.",
    tos2Title: 'Utilisation', tos2Body: 'Licence personnelle pour usage astronomique.',
    tos3Title: 'Compte', tos3Body: 'Vous etes responsable de vos identifiants.',
    tos4Title: 'Donnees', tos4Body: 'Nous collectons uniquement les donnees necessaires.',
    tos5Title: 'Propriete intellectuelle', tos5Body: "Tout le contenu appartient a CosmoKlub.",
    tos6Title: 'Responsabilite', tos6Body: "Donnees fournies sans garantie d'exactitude.",
    errFirst: 'Le prenom est obligatoire', errLast: 'Le nom est obligatoire',
    errEmail: 'E-mail valide requis', errPass: 'Minimum 8 caracteres',
    errConfirm: 'Les mots de passe ne correspondent pas', errTos: "Vous devez accepter les conditions",
    toastReg: 'Compte cree.', toastLogin: 'Connexion reussie.'
  },
  JA: {
    navHome: 'ホーム', navExplore: '探索', navObjects: '天体', navAbout: '概要',
    eyebrow: '次世代天文学プラットフォーム',
    heroLine1: '宇宙を', heroAccent: '探索', heroLine2: 'あなたの画面から。',
    heroSub: 'リアルタイム天体データ、深宇宙カタログ、インタラクティブ星図 — 美しいダッシュボードで。',
    startBtn: '探索を始める', learnBtn: '詳細を見る',
    featLabel: '機能', featTitle: '宇宙が求めるすべて。',
    featSub: 'アマチュアからプロまで対応した精密ツール。',
    objLabel: '天体', objTitle: '深宇宙カタログ。',
    objSub: '数千の天体をカタログ化。',
    ctaLabel: '参加', ctaTitle: 'あなたの天文台が待っています。',
    ctaSub: '無料アカウントを作成して今夜から宇宙を探索。',
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
    tos1Title: '同意', tos1Body: 'CosmoKlubにアクセスすることで利用規約に同意します。',
    tos2Title: '使用', tos2Body: '天文学的目的での個人ライセンスを付与します。',
    tos3Title: 'アカウント', tos3Body: '認証情報の機密性を維持する責任があります。',
    tos4Title: 'データ', tos4Body: '必要なデータのみを収集します。',
    tos5Title: '知的財産', tos5Body: 'すべてのコンテンツはCosmoKlubの財産です。',
    tos6Title: '責任', tos6Body: 'データは保証なしに提供されます。',
    errFirst: '名前は必須です', errLast: '姓は必須です',
    errEmail: '有効なメールが必要です', errPass: '8文字以上必要です',
    errConfirm: 'パスワードが一致しません', errTos: '利用規約に同意が必要です',
    toastReg: 'アカウント作成完了。', toastLogin: 'ログイン成功。'
  },
  TH: {
    navHome: 'หน้าแรก', navExplore: 'สำรวจ', navObjects: 'วัตถุ', navAbout: 'เกี่ยวกับ',
    eyebrow: 'แพลตฟอร์มดาราศาสตร์ยุคใหม่',
    heroLine1: 'สำรวจ', heroAccent: 'จักรวาล', heroLine2: 'จากหน้าจอของคุณ',
    heroSub: 'ข้อมูลท้องฟ้าแบบเรียลไทม์ แคตตาล็อกวัตถุท้องฟ้าลึก และแผนที่ดาวแบบโต้ตอบ — ในแดชบอร์ดที่สวยงาม',
    startBtn: 'เริ่มสำรวจ', learnBtn: 'เรียนรู้เพิ่มเติม',
    featLabel: 'ฟีเจอร์', featTitle: 'ทุกสิ่งที่จักรวาลต้องการ',
    featSub: 'เครื่องมือแม่นยำสำหรับนักดูดาวและนักวิจัย',
    objLabel: 'วัตถุ', objTitle: 'แคตตาล็อกท้องฟ้าลึก',
    objSub: 'วัตถุนับพันในฐานข้อมูลที่เติบโต',
    ctaLabel: 'เข้าร่วม', ctaTitle: 'หอดูดาวของคุณรอคุณอยู่',
    ctaSub: 'สร้างบัญชีฟรีและเริ่มสำรวจจักรวาลคืนนี้',
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
    tos1Title: 'การยอมรับ', tos1Body: 'การใช้ CosmoKlub แสดงว่าคุณยอมรับข้อกำหนดเหล่านี้',
    tos2Title: 'การใช้บริการ', tos2Body: 'ใบอนุญาตส่วนบุคคลสำหรับวัตถุประสงค์ทางดาราศาสตร์',
    tos3Title: 'ความรับผิดชอบ', tos3Body: 'คุณรับผิดชอบในการรักษาความลับของข้อมูล',
    tos4Title: 'ข้อมูล', tos4Body: 'เก็บรวบรวมเฉพาะข้อมูลที่จำเป็น',
    tos5Title: 'ทรัพย์สินทางปัญญา', tos5Body: 'เนื้อหาทั้งหมดเป็นทรัพย์สินของ CosmoKlub',
    tos6Title: 'การจำกัดความรับผิด', tos6Body: 'ข้อมูลให้บริการโดยไม่มีการรับประกัน',
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
      _pensiaFetched: false,
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
    async pensiaClick() {
      this.pensiaOpen = !this.pensiaOpen;
      if (!this.pensiaOpen) return;
      // Always re-fetch on every open for fresh content
      this.pensiaLoading = true;
      this.pensiaMsg = '';
      this.pensiaHeadline = '';
      try {
        const apodRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=TSTiFv4spdqyeg2tijUw3GwScNh2JA596I0qSnKa&count=3`);
        const apodData = await apodRes.json();
        const headlines = apodData.map(item => `"${item.title}" — ${item.explanation.slice(0, 100)}...`).join('\n');

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1000,
            system: 'You are Pensia, an adorable astronomy-loving penguin mascot. You just read some NASA astronomy highlights. Pick the most fascinating one and give a SHORT enthusiastic personal opinion (2-3 sentences, casual & cute). Return ONLY valid JSON no markdown: {"headline":"5 words or less title","opinion":"your 2-3 sentence take"}',
            messages: [{ role: 'user', content: `Astronomy highlights:\n${headlines}\n\nShare your favourite!` }]
          })
        });
        const data = await res.json();
        const text = data.content.map(c => c.text || '').join('');
        const clean = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        this.pensiaHeadline = parsed.headline || '🌌 Space news!';
        this.pensiaMsg = parsed.opinion || 'The cosmos is full of wonders today!';
      } catch (e) {
        const facts = [
          { h: '🌌 Galaxy count!', m: 'There are over 2 trillion galaxies in the observable universe. That\'s more galaxies than grains of sand on all Earth\'s beaches!' },
          { h: '☀️ Sun size!', m: 'About 1.3 million Earths could fit inside the Sun — and it\'s considered a medium-sized star. Wild, right?!' },
          { h: '🪐 Saturn floats!', m: 'Saturn is so light for its size it would actually float on water. I want to see that swimming pool!' },
          { h: '⭐ Old star light!', m: 'The light from the nearest star takes 4.2 years to reach us. We\'re literally seeing the past every night!' },
        ];
        const f = facts[Math.floor(Math.random() * facts.length)];
        this.pensiaHeadline = f.h;
        this.pensiaMsg = f.m;
      }
      this.pensiaLoading = false;
    },
    openModal(m) { this.modal = m; this.authTab = m === 'login' ? 'login' : 'register'; this.clearForm(); this.success = false; },
    closeModal() { this.modal = null; this.success = false; },
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
    document.addEventListener('click', e => { if (!e.target.closest('.lang-wrap')) this.langOpen = false; });
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
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
