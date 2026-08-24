/* ============================================================================
   CosmoKlub — sky.js
   Real numbers for the "Tonight's sky" strip on the Forum.

   Everything is computed in the browser. No API, no key, no network call, so
   the strip can't break because a third party went down or rate-limited us.

   Accuracy, honestly stated:
     • Moon phase / illumination — better than 1%. Uses the Sun–Moon
       elongation from a truncated ELP series, not a calendar approximation.
     • Planet rise times — typically within a few minutes, provided the
       observer's latitude is known. Positions come from the JPL "approximate
       elements" set, valid 1800–2050.
     • Location — from the browser's IANA time zone, so it needs no
       permission prompt. A zone table supplies lat/lon for common cities;
       anything unlisted falls back to a longitude derived from the UTC
       offset, and rise times are then approximate.

   Reference: Meeus, "Astronomical Algorithms" (2nd ed.), chapters 22, 25,
   47 and 15.
   ========================================================================= */

(function () {
  'use strict';

  var RAD = Math.PI / 180;
  var DEG = 180 / Math.PI;

  function norm360(x) { return ((x % 360) + 360) % 360; }
  function sin(d) { return Math.sin(d * RAD); }
  function cos(d) { return Math.cos(d * RAD); }

  /** Julian Day from a JS Date (UTC based). */
  function toJD(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }

  /** Julian centuries since J2000.0. */
  function centuries(jd) { return (jd - 2451545) / 36525; }

  /* ---------------------------------------------------------------- Sun */

  /** Geometric position of the Sun. Meeus ch. 25, low precision. */
  function sunPosition(jd) {
    var T = centuries(jd);
    var L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    var M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
            (0.019993 - 0.000101 * T) * sin(2 * M) +
            0.000289 * sin(3 * M);
    var trueLon = L0 + C;
    // Apparent longitude, corrected for nutation and aberration.
    var omega = 125.04 - 1934.136 * T;
    var lambda = trueLon - 0.00569 - 0.00478 * sin(omega);
    return { lambda: norm360(lambda), M: M, distance: 1.000001018 *
      (1 - 0.016708634 * 0.016708634) / (1 + 0.016708634 * cos(M + C)) };
  }

  /** Mean obliquity of the ecliptic, with the nutation term. Meeus ch. 22. */
  function obliquity(jd) {
    var T = centuries(jd);
    var e0 = 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
    var omega = 125.04 - 1934.136 * T;
    return e0 + 0.00256 * cos(omega);
  }

  /** Ecliptic (lambda, beta) -> equatorial (RA hours, Dec degrees). */
  function eclipticToEquatorial(lambda, beta, eps) {
    var ra = Math.atan2(
      sin(lambda) * cos(eps) - Math.tan(beta * RAD) * sin(eps),
      cos(lambda)
    ) * DEG;
    var dec = Math.asin(
      sin(beta) * cos(eps) + cos(beta) * sin(eps) * sin(lambda)
    ) * DEG;
    return { ra: norm360(ra) / 15, dec: dec };
  }

  /* --------------------------------------------------------------- Moon */

  /**
   * Moon's apparent ecliptic longitude and latitude. Meeus ch. 47, truncated
   * to the terms above ~0.03° — enough for phase and illumination to well
   * under 1%, which is all the strip claims.
   */
  function moonPosition(jd) {
    var T = centuries(jd);

    var Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
    var D  = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
    var M  = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
    var Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
    var F  = norm360(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);

    var lon = Lp
      + 6.288774 * sin(Mp)
      + 1.274027 * sin(2 * D - Mp)
      + 0.658314 * sin(2 * D)
      + 0.213618 * sin(2 * Mp)
      - 0.185116 * sin(M)
      - 0.114332 * sin(2 * F)
      + 0.058793 * sin(2 * D - 2 * Mp)
      + 0.057066 * sin(2 * D - M - Mp)
      + 0.053322 * sin(2 * D + Mp)
      + 0.045758 * sin(2 * D - M)
      - 0.040923 * sin(M - Mp)
      - 0.034720 * sin(D)
      - 0.030383 * sin(M + Mp)
      + 0.015327 * sin(2 * D - 2 * F)
      - 0.012528 * sin(Mp + 2 * F)
      + 0.010980 * sin(Mp - 2 * F);

    var lat =
        5.128122 * sin(F)
      + 0.280602 * sin(Mp + F)
      + 0.277693 * sin(Mp - F)
      + 0.173237 * sin(2 * D - F)
      + 0.055413 * sin(2 * D - Mp + F)
      + 0.046271 * sin(2 * D - Mp - F)
      + 0.032573 * sin(2 * D + F)
      + 0.017198 * sin(2 * Mp + F);

    // Distance in km — needed for the phase angle.
    var dist = 385000.56
      - 20905.355 * cos(Mp)
      - 3699.111 * cos(2 * D - Mp)
      - 2955.968 * cos(2 * D)
      - 569.925 * cos(2 * Mp);

    return { lambda: norm360(lon), beta: lat, distance: dist };
  }

  var PHASE_NAMES = [
    'New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous',
    'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'
  ];

  /**
   * Illuminated fraction and phase name.
   *
   * The fraction comes from the phase angle (Meeus 48.1), not from the age of
   * the lunation — the two disagree by a few percent because the Moon's orbit
   * is eccentric. The NAME, though, has to come from the elongation's sign,
   * since illumination alone can't tell waxing from waning: 60% lit happens
   * twice a month.
   */
  function moonPhase(jd) {
    var s = sunPosition(jd);
    var m = moonPosition(jd);

    // Sun distance in km, for the phase-angle geometry.
    var sunKm = s.distance * 149597870.7;

    var elong = Math.acos(
      cos(m.beta) * cos(m.lambda - s.lambda)
    ) * DEG;

    var phaseAngle = Math.atan2(
      sunKm * sin(elong),
      m.distance - sunKm * cos(elong)
    ) * DEG;

    var illum = (1 + cos(phaseAngle)) / 2;

    // 0..360 measured from new moon, increasing through the lunation.
    var age = norm360(m.lambda - s.lambda);

    // Eight equal 45° bins, offset by 22.5° so "Full moon" is centred on 180°
    // rather than starting there.
    var idx = Math.floor((norm360(age + 22.5)) / 45) % 8;

    return {
      name: PHASE_NAMES[idx],
      illumination: illum,
      percent: Math.round(illum * 100),
      age: age,
      waxing: age < 180,
      lambda: m.lambda,
      beta: m.beta
    };
  }

  /* ------------------------------------------------------------- Planets */

  /**
   * JPL approximate orbital elements, valid 1800–2050 (Standish).
   * a AU, e, I deg, L deg, longPeri deg, longNode deg — each with a per-
   * century rate. Magnitudes are rough means, only used to rank candidates.
   */
  var PLANETS = {
    Mercury: { el: [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593],
               rate: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081], mag: -0.2 },
    Venus:   { el: [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255],
               rate: [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418], mag: -4.1 },
    Earth:   { el: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
               rate: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0], mag: 0 },
    Mars:    { el: [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
               rate: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343], mag: 0.7 },
    Jupiter: { el: [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
               rate: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106], mag: -2.2 },
    Saturn:  { el: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
               rate: [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794], mag: 0.5 }
  };

  /** Solve Kepler's equation for the eccentric anomaly, in degrees. */
  function kepler(M, e) {
    var E = M + (e * DEG) * sin(M);
    for (var i = 0; i < 12; i++) {
      var dM = M - (E - (e * DEG) * sin(E));
      var dE = dM / (1 - e * cos(E));
      E += dE;
      if (Math.abs(dE) < 1e-9) break;
    }
    return E;
  }

  /** Heliocentric ecliptic rectangular coordinates, in AU. */
  function heliocentric(name, jd) {
    var p = PLANETS[name];
    var T = centuries(jd);

    var a = p.el[0] + p.rate[0] * T;
    var e = p.el[1] + p.rate[1] * T;
    var I = p.el[2] + p.rate[2] * T;
    var L = p.el[3] + p.rate[3] * T;
    var wbar = p.el[4] + p.rate[4] * T;
    var omega = p.el[5] + p.rate[5] * T;

    var argPeri = wbar - omega;
    var M = norm360(L - wbar + 180) - 180;

    var E = kepler(M, e);

    // In the orbital plane.
    var xp = a * (cos(E) - e);
    var yp = a * Math.sqrt(1 - e * e) * sin(E);

    // Rotate into the J2000 ecliptic frame.
    var cosw = cos(argPeri), sinw = sin(argPeri);
    var cosO = cos(omega), sinO = sin(omega);
    var cosI = cos(I), sinI = sin(I);

    return {
      x: (cosw * cosO - sinw * sinO * cosI) * xp + (-sinw * cosO - cosw * sinO * cosI) * yp,
      y: (cosw * sinO + sinw * cosO * cosI) * xp + (-sinw * sinO + cosw * cosO * cosI) * yp,
      z: (sinw * sinI) * xp + (cosw * sinI) * yp
    };
  }

  /** Geocentric RA/Dec of a planet. */
  function planetPosition(name, jd) {
    var p = heliocentric(name, jd);
    var earth = heliocentric('Earth', jd);

    var x = p.x - earth.x, y = p.y - earth.y, z = p.z - earth.z;
    var dist = Math.sqrt(x * x + y * y + z * z);

    // One light-time iteration — up to ~80 minutes for Saturn, which moves
    // the position by enough to matter at this precision.
    var lt = dist * 0.0057755183;
    p = heliocentric(name, jd - lt);
    x = p.x - earth.x; y = p.y - earth.y; z = p.z - earth.z;
    dist = Math.sqrt(x * x + y * y + z * z);

    var lambda = norm360(Math.atan2(y, x) * DEG);
    var beta = Math.asin(z / dist) * DEG;

    var eq = eclipticToEquatorial(lambda, beta, obliquity(jd));
    eq.distance = dist;
    return eq;
  }

  /* -------------------------------------------------- Rising and setting */

  /** Greenwich mean sidereal time in degrees. Meeus ch. 12. */
  function gmst(jd) {
    var T = centuries(jd);
    return norm360(
      280.46061837 + 360.98564736629 * (jd - 2451545) +
      0.000387933 * T * T - T * T * T / 38710000
    );
  }

  /**
   * UTC hour at which a body of the given RA/Dec rises, for the date of `jd`
   * at the given site. Returns null for circumpolar or never-rising bodies.
   *
   * h0 = -0.5667° accounts for refraction at the horizon.
   */
  function riseTimeUTC(jd0, ra, dec, lat, lon, h0) {
    if (h0 == null) h0 = -0.5667;

    var cosH = (sin(h0) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec));
    if (cosH > 1) return null;   // never rises
    if (cosH < -1) return null;  // circumpolar

    var H = Math.acos(cosH) * DEG;

    // Transit, as a fraction of a day from 0h UT.
    var theta0 = gmst(jd0);
    var transit = (ra * 15 + (-lon) - theta0) / 360;
    transit = transit - Math.floor(transit);

    var rise = transit - H / 360;
    rise = rise - Math.floor(rise);

    return rise * 24;
  }

  /* ------------------------------------------------------------ Location */

  /**
   * Coarse coordinates for common IANA zones. This is deliberately a small
   * table rather than a full database: it covers the zones most visitors will
   * report, and everything else degrades to a longitude derived from the UTC
   * offset (good to a few degrees) with the latitude unknown.
   */
  var ZONES = {
    'Asia/Bangkok': [13.75, 100.52, 'Bangkok'],
    'Asia/Singapore': [1.35, 103.82, 'Singapore'],
    'Asia/Jakarta': [-6.21, 106.85, 'Jakarta'],
    'Asia/Kuala_Lumpur': [3.14, 101.69, 'Kuala Lumpur'],
    'Asia/Manila': [14.60, 120.98, 'Manila'],
    'Asia/Ho_Chi_Minh': [10.82, 106.63, 'Ho Chi Minh City'],
    'Asia/Tokyo': [35.68, 139.69, 'Tokyo'],
    'Asia/Seoul': [37.57, 126.98, 'Seoul'],
    'Asia/Shanghai': [31.23, 121.47, 'Shanghai'],
    'Asia/Hong_Kong': [22.32, 114.17, 'Hong Kong'],
    'Asia/Taipei': [25.03, 121.57, 'Taipei'],
    'Asia/Kolkata': [22.57, 88.36, 'Kolkata'],
    'Asia/Calcutta': [22.57, 88.36, 'Kolkata'],
    'Asia/Dubai': [25.20, 55.27, 'Dubai'],
    'Asia/Karachi': [24.86, 67.01, 'Karachi'],
    'Asia/Dhaka': [23.81, 90.41, 'Dhaka'],
    'Australia/Sydney': [-33.87, 151.21, 'Sydney'],
    'Australia/Melbourne': [-37.81, 144.96, 'Melbourne'],
    'Australia/Perth': [-31.95, 115.86, 'Perth'],
    'Pacific/Auckland': [-36.85, 174.76, 'Auckland'],
    'Europe/London': [51.51, -0.13, 'London'],
    'Europe/Dublin': [53.35, -6.26, 'Dublin'],
    'Europe/Paris': [48.86, 2.35, 'Paris'],
    'Europe/Berlin': [52.52, 13.40, 'Berlin'],
    'Europe/Madrid': [40.42, -3.70, 'Madrid'],
    'Europe/Rome': [41.90, 12.50, 'Rome'],
    'Europe/Amsterdam': [52.37, 4.90, 'Amsterdam'],
    'Europe/Stockholm': [59.33, 18.07, 'Stockholm'],
    'Europe/Oslo': [59.91, 10.75, 'Oslo'],
    'Europe/Warsaw': [52.23, 21.01, 'Warsaw'],
    'Europe/Moscow': [55.76, 37.62, 'Moscow'],
    'Europe/Istanbul': [41.01, 28.98, 'Istanbul'],
    'Europe/Lisbon': [38.72, -9.14, 'Lisbon'],
    'Europe/Zurich': [47.38, 8.54, 'Zurich'],
    'Europe/Athens': [37.98, 23.73, 'Athens'],
    'America/New_York': [40.71, -74.01, 'New York'],
    'America/Toronto': [43.65, -79.38, 'Toronto'],
    'America/Chicago': [41.88, -87.63, 'Chicago'],
    'America/Denver': [39.74, -104.99, 'Denver'],
    'America/Phoenix': [33.45, -112.07, 'Phoenix'],
    'America/Los_Angeles': [34.05, -118.24, 'Los Angeles'],
    'America/Vancouver': [49.28, -123.12, 'Vancouver'],
    'America/Mexico_City': [19.43, -99.13, 'Mexico City'],
    'America/Bogota': [4.71, -74.07, 'Bogota'],
    'America/Lima': [-12.05, -77.04, 'Lima'],
    'America/Sao_Paulo': [-23.55, -46.63, 'Sao Paulo'],
    'America/Argentina/Buenos_Aires': [-34.60, -58.38, 'Buenos Aires'],
    'America/Santiago': [-33.45, -70.67, 'Santiago'],
    'Africa/Cairo': [30.04, 31.24, 'Cairo'],
    'Africa/Lagos': [6.52, 3.38, 'Lagos'],
    'Africa/Nairobi': [-1.29, 36.82, 'Nairobi'],
    'Africa/Johannesburg': [-26.20, 28.05, 'Johannesburg'],
    'Asia/Riyadh': [24.71, 46.68, 'Riyadh'],
    'Asia/Tehran': [35.69, 51.39, 'Tehran'],
    'Asia/Jerusalem': [31.77, 35.21, 'Jerusalem'],
    'Pacific/Honolulu': [21.31, -157.86, 'Honolulu']
  };

  /**
   * Where the visitor is, without asking for permission. The time zone is
   * always available and is enough for a city label plus usable coordinates.
   */
  function resolveSite() {
    var tz = '';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) { /* very old browser — fall through */ }

    if (ZONES[tz]) {
      return { lat: ZONES[tz][0], lon: ZONES[tz][1], place: ZONES[tz][2], exact: true };
    }

    // Unlisted zone: the UTC offset fixes longitude to within ~7.5°, which is
    // half an hour of rise time. Latitude is genuinely unknown, so use the
    // zone's own city name and accept a rougher answer.
    var offsetMin = -new Date().getTimezoneOffset();
    var lon = (offsetMin / 60) * 15;
    var city = tz.split('/').pop().replace(/_/g, ' ') || 'your';

    return { lat: 0, lon: lon, place: city, exact: false };
  }

  /* --------------------------------------------------------------- Strip */

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /**
   * Format a UTC hour-of-day as a local HH:MM string.
   */
  function formatLocal(utcHour, date) {
    if (utcHour == null) return null;
    var offsetHours = -date.getTimezoneOffset() / 60;
    var local = ((utcHour + offsetHours) % 24 + 24) % 24;
    var h = Math.floor(local);
    var m = Math.round((local - h) * 60);
    if (m === 60) { m = 0; h = (h + 1) % 24; }
    return pad2(h) + ':' + pad2(m);
  }

  /**
   * Pick the planet worth mentioning tonight.
   *
   * "Worth mentioning" means: up during the evening, and bright. Altitude is
   * sampled at 22:00 local — late enough that the sky is dark everywhere,
   * early enough that most people are still awake. Ties go to the brighter
   * object, so Jupiter beats Saturn when both are well placed.
   */
  function pickPlanet(date, site) {
    var evening = new Date(date);
    evening.setHours(22, 0, 0, 0);
    var jd = toJD(evening);
    var jd0 = Math.floor(toJD(date) - 0.5) + 0.5;

    var theta = gmst(jd) + site.lon;
    var best = null;

    ['Venus', 'Jupiter', 'Saturn', 'Mars', 'Mercury'].forEach(function (name) {
      var pos = planetPosition(name, jd);

      var H = norm360(theta - pos.ra * 15);
      var alt = Math.asin(
        sin(site.lat) * sin(pos.dec) + cos(site.lat) * cos(pos.dec) * cos(H)
      ) * DEG;

      // Below about 10° it is in the murk near the horizon — not worth
      // sending someone outside for.
      if (alt < 10) return;

      var score = alt - PLANETS[name].mag * 6;
      if (!best || score > best.score) {
        best = {
          name: name,
          altitude: alt,
          score: score,
          rise: riseTimeUTC(jd0, pos.ra, pos.dec, site.lat, site.lon)
        };
      }
    });

    return best;
  }

  /**
   * The whole strip, ready to render.
   * Returns { title, subtitle, icon, illumination }.
   */
  function tonight(now) {
    var date = now ? new Date(now) : new Date();
    var jd = toJD(date);
    var site = resolveSite();

    var phase = moonPhase(jd);

    // Moon glyph matching the phase, so the icon isn't a fixed ◐.
    var glyphs = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    var glyphIdx = Math.floor(norm360(phase.age + 22.5) / 45) % 8;

    var title = phase.name + ', ' + phase.percent + '% lit';

    var planet = pickPlanet(date, site);
    var subtitle;

    if (planet) {
      var riseStr = formatLocal(planet.rise, date);
      var where = site.exact ? site.place + ' sky' : 'your sky';
      subtitle = 'Good night for ' + planet.name +
        (riseStr ? ', rises ' + riseStr : '') + ', ' + where;
    } else {
      // Nothing bright is up — say so rather than inventing a planet.
      subtitle = phase.percent > 80
        ? 'Bright moonlight tonight — a good night for lunar detail'
        : 'No bright planets up this evening — good for deep sky';
      if (site.exact) subtitle += ', ' + site.place + ' sky';
    }

    return {
      title: title,
      subtitle: subtitle,
      icon: glyphs[glyphIdx],
      illumination: phase.illumination,
      phase: phase.name,
      percent: phase.percent,
      planet: planet ? planet.name : null,
      place: site.place,
      exact: site.exact
    };
  }

  var SkyNow = {
    tonight: tonight,
    moonPhase: moonPhase,
    planetPosition: planetPosition,
    sunPosition: sunPosition,
    riseTimeUTC: riseTimeUTC,
    resolveSite: resolveSite,
    toJD: toJD,
    gmst: gmst,
    formatLocal: formatLocal
  };

  if (typeof window !== 'undefined') window.SkyNow = SkyNow;
  if (typeof module !== 'undefined' && module.exports) module.exports = SkyNow;
})();
