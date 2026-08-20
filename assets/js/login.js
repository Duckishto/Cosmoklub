const { createApp } = Vue;

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const USERNAME_RE = /^[a-zA-Z0-9._]+$/;
const NAME_RE = /^[\p{L}][\p{L}\s'-]*$/u;
const COMMON_PASSWORDS = [
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwerty123', 'qwertyui', 'letmein1', 'welcome1', 'admin123', 'iloveyou',
  'abc12345', 'football', 'baseball', 'sunshine', 'princess', 'trustno1'
];

const T = {
  signIn: 'Sign in', register: 'Register',
  createAcc: 'Create Account', welcomeBack: 'Welcome back',
  loginSub: 'Sign in to your observatory', joinUs: 'Join thousands of astronomers',
  firstName: 'First Name', lastName: 'Last Name', firstPH: 'Galileo', lastPH: 'Galilei',
  usernameLabel: 'Username', usernamePH: 'galileo_g',
  genderLabel: 'Gender', genderPH: 'Select gender',
  genderMale: 'Male', genderFemale: 'Female', genderOther: 'Other', genderPNTS: 'Prefer not to say',
  emailLabel: 'Email', emailPH: 'you@cosmos.space', passLabel: 'Password',
  passPH: 'Min. 8 characters', confirmPass: 'Confirm Password', confirmPH: 'Repeat password',
  tosAgree: 'I agree to the', tosAnd: 'and', forgotPass: 'Forgot password?',
  orContinue: 'or continue with', loading: 'Loading...',
  tos: 'Terms of Service', privacy: 'Privacy Policy',
  errFirst: 'First name is required',
  errFirstShort: 'First name must be at least 2 characters',
  errFirstChars: 'First name can only contain letters, spaces, hyphens and apostrophes',
  errLast: 'Last name is required',
  errLastShort: 'Last name must be at least 2 characters',
  errLastChars: 'Last name can only contain letters, spaces, hyphens and apostrophes',
  errUsername: 'Username is required',
  errUsernameShort: 'Username must be at least 3 characters',
  errUsernameLong: 'Username must be 20 characters or fewer',
  errUsernameChars: 'Use only letters, numbers, underscores and dots',
  errUsernameEdge: 'Username must start and end with a letter or number',
  errGender: 'Please select a gender',
  errEmail: 'Enter a valid email address',
  errEmailLong: 'Email address is too long',
  errPass: 'Password must be at least 8 characters',
  errPassLong: 'Password must be 72 characters or fewer',
  errPassUpper: 'Include at least one uppercase letter',
  errPassLower: 'Include at least one lowercase letter',
  errPassDigit: 'Include at least one number',
  errPassCommon: 'This password is too common — choose something less guessable',
  errPassSame: 'Password should not contain your username or email',
  errConfirmReq: 'Please confirm your password',
  errConfirm: 'Passwords do not match',
  errTos: 'You must accept the Terms of Service',
  errPassReq: 'Password is required',
  strengthWeak: 'Weak', strengthFair: 'Fair', strengthGood: 'Good', strengthStrong: 'Strong',
  showPass: 'Show password', hidePass: 'Hide password',
  errNoSupabase: 'Sign-up is not configured yet. Please try again later.',
  toastReg: 'Account created. Welcome to CosmoKlub.', toastLogin: 'Signed in successfully.',
  panelTitle: 'Make exploring simple, and discovery limitless',
  checkInbox: 'Check your inbox',
  checkInboxSub: 'We sent you a confirmation link. Click it to activate your account.',
  successTitle: 'You are all set',
  successSub: 'Taking you to your dashboard...',
  backHome: 'Back to home',
  newHere: 'New here?', haveAcc: 'Already have an account?',
  rights: 'All rights reserved.',
  stepOf: 'Step', stepOfTotal: 'of 2',
  stepAbout: 'About you', stepAccount: 'Account details',
  next: 'Continue', back: 'Back'
};

createApp({
  data() {
    return {
      t: T,
      authTab: 'login',
      form: { firstName: '', lastName: '', username: '', gender: '', email: '', password: '', confirm: '', tos: false },
      errors: {},
      loading: false,
      socialLoading: false,
      success: false,
      pendingEmailConfirm: false,
      touched: {},
      regStep: 1,
      showPassword: false,
      showConfirm: false,
      currentUser: null,
      toast: null,
      panelImage: ''
    };
  },
  computed: {
    footerCols() {
      return [
        {
          title: 'Tools',
          links: [
            { text: 'Forum', href: 'tools/forum.html' },
            { text: 'Library', href: 'tools/library.html' },
            { text: 'Calculator & Graphing', href: 'tools/calcgraph.html' },
            { text: 'Community Server', href: 'tools/comserver.html' }
          ]
        },
        {
          title: 'Use Cases',
          links: [
            { text: 'Student', href: 'usecases/student.html' },
            { text: 'Professor', href: 'usecases/professor.html' },
            { text: 'Tutor', href: 'usecases/tutor.html' },
            { text: 'Hobbyist', href: 'usecases/hobbyist.html' }
          ]
        },
        {
          title: 'Project',
          links: [
            { text: 'Our Team', href: 'team.html' },
            { text: 'Apply as Staff', href: 'staff-application.html' },
            { text: 'Report Bug', href: '#' },
            { text: 'Contact', href: 'mailto:hello@cosmoklub.space' }
          ]
        },
        {
          title: 'Legal',
          links: [
            { text: 'Terms of Service', href: 'index.html#tos' },
            { text: 'Privacy Policy', href: 'index.html#privacy' },
            { text: 'Community Guidelines', href: '#' },
            { text: 'Cookie Policy', href: '#' }
          ]
        }
      ];
    },
    passwordChecks() {
      const pw = this.form.password || '';
      return {
        length: pw.length >= 8,
        upper: /[A-Z]/.test(pw),
        lower: /[a-z]/.test(pw),
        digit: /[0-9]/.test(pw),
        symbol: /[^A-Za-z0-9]/.test(pw)
      };
    },
    passwordScore() {
      const c = this.passwordChecks;
      let score = [c.length, c.upper, c.lower, c.digit, c.symbol].filter(Boolean).length;
      if ((this.form.password || '').length >= 12 && score >= 4) score = 5;
      return score;
    },
    passwordPercent() {
      if (!this.form.password) return 0;
      return Math.round((this.passwordScore / 5) * 100);
    },
    passwordHint() {
      const pw = this.form.password || '';
      if (!pw) return 'Use at least 8 characters with an uppercase letter, a lowercase letter and a number.';
      const missing = [];
      const c = this.passwordChecks;
      if (!c.length) missing.push('8 characters');
      if (!c.upper) missing.push('an uppercase letter');
      if (!c.lower) missing.push('a lowercase letter');
      if (!c.digit) missing.push('a number');
      if (missing.length) {
        const list = missing.length > 1
          ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1]
          : missing[0];
        return 'Still needs ' + list + '.';
      }
      if (!c.symbol) return 'Good password — adding a symbol would make it stronger.';
      return 'Strong password.';
    },
    passwordStrength() {
      const s = this.passwordScore;
      if (!this.form.password) return { level: 0, label: '', key: '' };
      if (s <= 2) return { level: 1, label: this.t.strengthWeak, key: 'weak' };
      if (s === 3) return { level: 2, label: this.t.strengthFair, key: 'fair' };
      if (s === 4) return { level: 3, label: this.t.strengthGood, key: 'good' };
      return { level: 4, label: this.t.strengthStrong, key: 'strong' };
    }
  },
  methods: {
    switchTab(tab) {
      this.authTab = tab;
      this.clearForm();
      this.success = false;
    },
    clearForm() {
      this.form = { firstName: '', lastName: '', username: '', gender: '', email: '', password: '', confirm: '', tos: false };
      this.errors = {};
      this.touched = {};
      this.regStep = 1;
      this.showPassword = false;
      this.showConfirm = false;
      this.pendingEmailConfirm = false;
    },
    validateField(field) {
      const t = this.t;
      const f = this.form;
      const v = (f[field] ?? '');
      const val = typeof v === 'string' ? v.trim() : v;
      let msg = '';

      switch (field) {
        case 'firstName':
        case 'lastName': {
          const isFirst = field === 'firstName';
          if (!val) msg = isFirst ? t.errFirst : t.errLast;
          else if (val.length < 2) msg = isFirst ? t.errFirstShort : t.errLastShort;
          else if (!NAME_RE.test(val)) msg = isFirst ? t.errFirstChars : t.errLastChars;
          break;
        }
        case 'username':
          if (!val) msg = t.errUsername;
          else if (val.length < 3) msg = t.errUsernameShort;
          else if (val.length > 20) msg = t.errUsernameLong;
          else if (!USERNAME_RE.test(val)) msg = t.errUsernameChars;
          else if (!/^[a-zA-Z0-9].*[a-zA-Z0-9]$/.test(val)) msg = t.errUsernameEdge;
          break;
        case 'gender':
          if (!val) msg = t.errGender;
          break;
        case 'email':
          if (!val) msg = t.errEmail;
          else if (val.length > 254) msg = t.errEmailLong;
          else if (!EMAIL_RE.test(val)) msg = t.errEmail;
          break;
        case 'password': {
          const pw = f.password;
          if (!pw) msg = t.errPassReq;
          else if (pw.length < 8) msg = t.errPass;
          else if (pw.length > 72) msg = t.errPassLong;
          else if (!/[A-Z]/.test(pw)) msg = t.errPassUpper;
          else if (!/[a-z]/.test(pw)) msg = t.errPassLower;
          else if (!/[0-9]/.test(pw)) msg = t.errPassDigit;
          else if (COMMON_PASSWORDS.includes(pw.toLowerCase())) msg = t.errPassCommon;
          else if (this.passwordEchoesIdentity(pw)) msg = t.errPassSame;
          break;
        }
        case 'confirm':
          if (!f.confirm) msg = t.errConfirmReq;
          else if (f.password !== f.confirm) msg = t.errConfirm;
          break;
        case 'tos':
          if (!f.tos) msg = t.errTos;
          break;
      }

      if (msg) this.errors = { ...this.errors, [field]: msg };
      else {
        const next = { ...this.errors };
        delete next[field];
        this.errors = next;
      }
      return !msg;
    },
    passwordEchoesIdentity(pw) {
      const low = pw.toLowerCase();
      const uname = this.form.username.trim().toLowerCase();
      const local = this.form.email.trim().toLowerCase().split('@')[0];
      if (uname.length >= 3 && low.includes(uname)) return true;
      if (local.length >= 3 && low.includes(local)) return true;
      return false;
    },
    touch(field) {
      this.touched = { ...this.touched, [field]: true };
      this.validateField(field);
    },
    regStepFields(step) {
      return step === 1
        ? ['firstName', 'lastName', 'username', 'gender']
        : ['email', 'password', 'confirm', 'tos'];
    },
    validateRegStep(step) {
      const fields = this.regStepFields(step);
      const touched = { ...this.touched };
      fields.forEach(f => { touched[f] = true; });
      this.touched = touched;
      return fields.map(f => this.validateField(f)).every(Boolean);
    },
    nextStep() {
      if (this.validateRegStep(1)) this.regStep = 2;
    },
    prevStep() {
      this.regStep = 1;
    },
    validateRegister() {
      const fields = ['firstName', 'lastName', 'username', 'gender', 'email', 'password', 'confirm', 'tos'];
      const touched = {};
      fields.forEach(f => { touched[f] = true; });
      this.touched = touched;
      const results = fields.map(f => this.validateField(f));
      return results.every(Boolean);
    },
    validateLogin() {
      const fields = ['email', 'password'];
      const touched = {};
      fields.forEach(f => { touched[f] = true; });
      this.touched = touched;
      const e = {};
      const t = this.t;
      const email = this.form.email.trim();
      if (!email) e.email = t.errEmail;
      else if (!EMAIL_RE.test(email)) e.email = t.errEmail;
      if (!this.form.password) e.password = t.errPassReq;
      this.errors = e;
      return !Object.keys(e).length;
    },
    async submitRegister() {
      if (!this.validateRegister()) return;
      const client = window.supabaseClient || await window.supabaseReady;
      if (!client) {
        this.errors = { submit: this.t.errNoSupabase };
        return;
      }
      this.loading = true;
      this.errors = {};
      try {
        const username = this.form.username.trim();
        const { data, error } = await client.auth.signUp({
          email: this.form.email.trim(),
          password: this.form.password,
          options: {
            data: {
              username,
              gender: this.form.gender,
              first_name: this.form.firstName.trim(),
              last_name: this.form.lastName.trim()
            }
          }
        });
        if (error) {
          this.errors = { submit: error.message };
          this.loading = false;
          return;
        }
        if (data.session) {
          this.currentUser = data.user;
          this.pendingEmailConfirm = false;
          this.showToast(this.t.toastReg);
          this.redirectSoon();
        } else {
          this.currentUser = null;
          this.pendingEmailConfirm = true;
        }
        this.loading = false;
        this.success = true;
      } catch (err) {
        this.errors = { submit: err.message || String(err) };
        this.loading = false;
      }
    },
    async submitLogin() {
      if (!this.validateLogin()) return;
      const client = window.supabaseClient || await window.supabaseReady;
      if (!client) {
        this.errors = { submit: this.t.errNoSupabase };
        return;
      }
      this.loading = true;
      this.errors = {};
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: this.form.email.trim(),
          password: this.form.password
        });
        if (error) {
          this.errors = { submit: error.message };
          this.loading = false;
          return;
        }
        this.currentUser = data.user;
        this.loading = false;
        this.success = true;
        this.showToast(this.t.toastLogin);
        this.redirectSoon();
      } catch (err) {
        this.errors = { submit: err.message || String(err) };
        this.loading = false;
      }
    },
    async socialLogin(provider) {
      const client = window.supabaseClient || await window.supabaseReady;
      if (!client) {
        this.errors = { social: this.t.errNoSupabase };
        return;
      }
      this.socialLoading = true;
      this.errors = {};
      try {
        const { error } = await client.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin + '/dashboard.html' }
        });
        if (error) {
          this.errors = { social: error.message };
          this.socialLoading = false;
        }
      } catch (err) {
        this.errors = { social: err.message || String(err) };
        this.socialLoading = false;
      }
    },
    redirectSoon() {
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    },
    showToast(msg) {
      this.toast = msg;
      setTimeout(() => { this.toast = null; }, 3400);
    }
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'register') this.authTab = 'register';

    document.addEventListener('contextmenu', e => {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('dragstart', e => {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });

    if (window.CosmoKlub && window.CosmoKlub.initStarfield) {
      window.CosmoKlub.initStarfield(160);
    }
  }
}).mount('#login-app');
