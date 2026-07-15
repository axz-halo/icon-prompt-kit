// Daum Graphic Generator — 클라이언트 생성 엔진 v2
// 키워드 → 모티프 라이브러리(실제 형태) 또는 추상 폴백을 스타일 DNA로 생성
(function () {
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const rand = (r, a, b) => a + r() * (b - a);

  // 공식 팔레트
  const RED = "#E94B35", DRED = "#C23824", YEL = "#F2C500", ORA = "#F59D00",
    LIME = "#8BC02F", DGRN = "#42A141", GRAY = "#EBEBEB", MGRAY = "#BEBEBE",
    DARK = "#323232", BROWN = "#8D5836", TAN = "#BF9760", PUR = "#9C56B8",
    DPUR = "#6D2AB0", CYAN = "#05A9E3";

  const st = (c, w) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"`;
  const shine = (x, y, w = 24) => `<path d="M${x} ${y} q-16 30 2 58" ${st(GRAY, w)}/>`;

  /* ── 모티프 라이브러리 ─────────────────────────────
     각 모티프: { kw: [별칭들], desc: 프롬프트 바디, draw(r): svg } */
  const MOTIFS = {
    gimbap: {
      kw: ["김밥", "gimbap", "kimbap", "롤", "마키"],
      desc: `flat vector icon of a gimbap seaweed rice roll seen face-on, dark gray ${DARK} nori ring with light gray ${GRAY} rice inside, small filling pieces in lime green ${LIME}, orange ${ORA}, red ${RED} and yellow ${YEL} at the center`,
      draw(r) {
        const t = rand(r, -8, 8);
        return `<g transform="rotate(${t} 256 256)">
          <circle cx="256" cy="256" r="168" fill="${DARK}"/>
          <circle cx="256" cy="256" r="128" fill="${GRAY}"/>
          <rect x="216" y="216" width="34" height="80" rx="15" fill="${LIME}" transform="rotate(${rand(r, -14, 14)} 233 256)"/>
          <rect x="262" y="212" width="30" height="86" rx="14" fill="${ORA}" transform="rotate(${rand(r, -14, 14)} 277 255)"/>
          <circle cx="256" cy="200" r="22" fill="${RED}"/>
          <circle cx="230" cy="300" r="20" fill="${YEL}"/>
          <circle cx="292" cy="298" r="17" fill="${TAN}"/>
        </g>`;
      },
    },
    coffee: {
      kw: ["커피", "coffee", "아메리카노", "카페", "머그", "mug", "라떼", "latte"],
      desc: `flat vector icon of a coffee mug, cyan blue ${CYAN} cup with a light gray ${GRAY} band, rounded handle on the right, two light gray steam squiggles above`,
      draw(r) {
        const band = pick(r, [GRAY, YEL, RED]);
        return `<path d="M120 190 L356 190 L338 400 Q336 428 306 428 L170 428 Q140 428 138 400 Z" fill="${CYAN}"/>
          <rect x="128" y="238" width="220" height="30" rx="15" fill="${band}"/>
          <path d="M356 220 q60 4 54 62 q-6 56 -68 50" ${st(CYAN, 26)}/>
          <path d="M196 148 q-12 -26 6 -48 M262 150 q-12 -28 6 -50" ${st(GRAY, 18)}/>
          ${r() < 0.5 ? `<ellipse cx="238" cy="464" rx="120" ry="14" fill="${GRAY}"/>` : ""}`;
      },
    },
    cake: {
      kw: ["케이크", "cake", "생일케이크", "홀케이크", "조각케이크"],
      desc: `flat vector icon of a two-layer cake, tan ${TAN} sponge with a light gray ${GRAY} wavy icing drip on top, red ${RED} cherry with a stem, small light gray dots on the side`,
      draw(r) {
        const body = pick(r, [TAN, PUR, CYAN]);
        return `<rect x="110" y="240" width="292" height="180" rx="26" fill="${body}"/>
          <path d="M110 268 q24 26 48 0 q24 26 48 0 q24 26 49 0 q24 26 48 0 q24 26 48 0 q24 26 51 0 L402 240 L110 240 Z" fill="${GRAY}"/>
          <rect x="86" y="410" width="340" height="26" rx="13" fill="${MGRAY}"/>
          <circle cx="256" cy="176" r="26" fill="${RED}"/>
          <path d="M256 156 q6 -28 30 -34" ${st(DGRN, 13)}/>
          <circle cx="180" cy="360" r="12" fill="${GRAY}"/>
          <circle cx="256" cy="376" r="12" fill="${GRAY}"/>
          <circle cx="330" cy="360" r="12" fill="${GRAY}"/>`;
      },
    },
    egg: {
      kw: ["계란", "달걀", "계란프라이", "egg", "fried egg", "에그"],
      desc: `flat vector icon of a fried egg, wobbly light gray ${GRAY} white blob with a round yellow ${YEL} yolk offset from center, one small light gray shine dot on the yolk`,
      draw(r) {
        const pts = [];
        const n = 9;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const rr = 175 * rand(r, 0.82, 1.12);
          pts.push([256 + Math.cos(a) * rr, 262 + Math.sin(a) * rr * 0.92]);
        }
        let d = "";
        for (let i = 0; i < n; i++) {
          const nx = pts[(i + 1) % n], m2 = pts[(i + 2) % n];
          const mx = (nx[0] + m2[0]) / 2, my = (nx[1] + m2[1]) / 2;
          if (i === 0) { const p = pts[0], q = pts[1]; d = `M ${(p[0] + q[0]) / 2} ${(p[1] + q[1]) / 2} `; }
          d += `Q ${nx[0]} ${nx[1]} ${mx} ${my} `;
        }
        const yx = 256 + rand(r, -34, 34), yy = 258 + rand(r, -22, 22);
        return `<path d="${d}Z" fill="${GRAY}"/>
          <circle cx="${yx}" cy="${yy}" r="74" fill="${YEL}"/>
          <circle cx="${yx + 22}" cy="${yy - 22}" r="13" fill="${GRAY}"/>`;
      },
    },
    bread: {
      kw: ["빵", "식빵", "bread", "토스트", "toast", "베이커리"],
      desc: `flat vector icon of a bread loaf, tan ${TAN} rounded loaf with a brown ${BROWN} rounded top crust, one light gray ${GRAY} curved shine mark`,
      draw(r) {
        return `<path d="M96 236 Q96 140 256 140 Q416 140 416 236 L416 396 Q416 424 388 424 L124 424 Q96 424 96 396 Z" fill="${TAN}"/>
          <path d="M96 236 Q96 140 256 140 Q416 140 416 236 L416 262 L96 262 Z" fill="${BROWN}"/>
          ${shine(180, 300)}
          <path d="M292 300 q-14 28 2 54" ${st(GRAY, 20)}/>`;
      },
    },
    fish: {
      kw: ["생선", "물고기", "fish", "붕어", "연어"],
      desc: `flat vector icon of a fish facing left, cyan blue ${CYAN} oval body with a triangular tail, light gray ${GRAY} belly stripe, one dark gray ${DARK} round eye and curved gill stroke`,
      draw(r) {
        const c = pick(r, [CYAN, RED, ORA]);
        return `<g transform="rotate(${rand(r, -8, 8)} 256 256)">
          <ellipse cx="230" cy="256" rx="160" ry="106" fill="${c}"/>
          <path d="M366 256 L460 180 L444 256 L460 332 Z" fill="${c}" stroke-linejoin="round"/>
          <path d="M120 300 q90 42 200 8" ${st(GRAY, 24)}/>
          <circle cx="140" cy="228" r="15" fill="${DARK}"/>
          <path d="M196 218 q18 34 0 72" ${st(GRAY, 15)}/>
        </g>`;
      },
    },
    tomato: {
      kw: ["토마토", "tomato", "방울토마토"],
      desc: `flat vector icon of a tomato, red ${RED} round body with a lime green ${LIME} star-shaped calyx and short stem on top, one light gray ${GRAY} curved shine mark`,
      draw(r) {
        return `<circle cx="256" cy="280" r="162" fill="${RED}"/>
          <path d="M256 122 l38 34 l-38 12 l-38 -12 Z" fill="${LIME}" stroke-linejoin="round"/>
          <path d="M188 140 l68 28 M324 140 l-68 28" ${st(LIME, 26)}/>
          <path d="M256 130 q-4 -30 22 -44" ${st(LIME, 18)}/>
          ${shine(184, 234)}`;
      },
    },
    carrot: {
      kw: ["당근", "carrot"],
      desc: `flat vector icon of a carrot tilted 45 degrees, orange ${ORA} tapered rounded body pointing lower-left, three lime green ${LIME} leaf strokes at the top, two light gray ${GRAY} short dashes on the body`,
      draw(r) {
        return `<g transform="rotate(${rand(r, -6, 8)} 256 256)">
          <path d="M150 400 Q120 430 108 396 Q100 372 132 344 L318 170 Q356 140 380 170 Q402 198 372 230 Z" fill="${ORA}"/>
          <path d="M352 148 q-4 -44 30 -66 M382 172 q30 -30 74 -26 M368 158 q22 -40 66 -48" ${st(LIME, 22)}/>
          <path d="M232 300 l30 -26 M182 344 l26 -22" ${st(GRAY, 18)}/>
        </g>`;
      },
    },
    mushroom: {
      kw: ["버섯", "mushroom"],
      desc: `flat vector icon of a mushroom, red ${RED} dome cap with three light gray ${GRAY} round dots, plump light gray stem below`,
      draw(r) {
        const cap = pick(r, [RED, ORA, TAN]);
        return `<path d="M76 268 Q76 108 256 108 Q436 108 436 268 Q436 292 408 292 L104 292 Q76 292 76 268 Z" fill="${cap}"/>
          <circle cx="176" cy="204" r="22" fill="${GRAY}"/>
          <circle cx="272" cy="168" r="17" fill="${GRAY}"/>
          <circle cx="340" cy="226" r="19" fill="${GRAY}"/>
          <path d="M196 292 L316 292 L302 396 Q300 424 272 424 L240 424 Q212 424 210 396 Z" fill="${GRAY}"/>`;
      },
    },
    corn: {
      kw: ["옥수수", "corn"],
      desc: `flat vector icon of a corn cob tilted 45 degrees, yellow ${YEL} oval body with a grid of light gray ${GRAY} rounded kernel dashes, two lime green ${LIME} husk leaves at the base`,
      draw(r) {
        return `<g transform="rotate(40 256 256)">
          <ellipse cx="256" cy="230" rx="102" ry="190" fill="${YEL}"/>
          ${[0, 1, 2].map((row) => [0, 1].map((col) =>
            `<path d="M${222 + col * 56} ${140 + row * 80} l14 22" ${st(GRAY, 18)}/>`).join("")).join("")}
          <path d="M256 420 Q160 430 150 340 Q220 350 256 420 Z" fill="${LIME}"/>
          <path d="M256 420 Q352 430 362 340 Q292 350 256 420 Z" fill="${DGRN}"/>
        </g>`;
      },
    },
    heart: {
      kw: ["하트", "heart", "사랑", "좋아요"],
      desc: `flat vector icon of a plump heart, red ${RED} rounded heart with one light gray ${GRAY} curved shine mark at the upper left and one small accent circle`,
      draw(r) {
        const c = pick(r, [RED, PUR, CYAN]);
        return `<g transform="rotate(${rand(r, -8, 8)} 256 256)">
          <path d="M256 428 C 130 340 92 250 140 186 C 184 130 246 158 256 210 C 266 158 328 130 372 186 C 420 250 382 340 256 428 Z" fill="${c}"/>
          ${shine(180, 210)}
          <circle cx="368" cy="140" r="16" fill="${c === RED ? PUR : RED}"/>
        </g>`;
      },
    },
    star: {
      kw: ["별", "star", "스타"],
      desc: `flat vector icon of a five-pointed star with rounded tips, yellow ${YEL} body with a light gray ${GRAY} asterisk mark radiating from the center`,
      draw(r) {
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
          const rr = i % 2 === 0 ? 180 : 92;
          pts.push(`${256 + Math.cos(a) * rr},${266 + Math.sin(a) * rr}`);
        }
        return `<g transform="rotate(${rand(r, -12, 12)} 256 256)">
          <polygon points="${pts.join(" ")}" fill="${YEL}" stroke="${YEL}" stroke-width="52" stroke-linejoin="round"/>
          ${[0, 60, 120].map((a) => `<path d="M256 236 l0 60" ${st(GRAY, 18)} transform="rotate(${a} 256 266)"/>`).join("")}
        </g>`;
      },
    },
    house: {
      kw: ["집", "house", "home", "주택", "홈"],
      desc: `flat vector icon of a house, light gray ${GRAY} square body with a red ${RED} triangular roof, cyan blue ${CYAN} door and one square window`,
      draw(r) {
        const roof = pick(r, [RED, CYAN, DGRN]);
        return `<rect x="120" y="230" width="272" height="190" rx="18" fill="${GRAY}"/>
          <path d="M84 246 L256 96 L428 246 Z" fill="${roof}" stroke="${roof}" stroke-width="36" stroke-linejoin="round"/>
          <rect x="222" y="300" width="70" height="120" rx="14" fill="${roof === CYAN ? RED : CYAN}"/>
          <rect x="140" y="264" width="52" height="52" rx="12" fill="${MGRAY}"/>
          <rect x="322" y="264" width="52" height="52" rx="12" fill="${MGRAY}"/>`;
      },
    },
    car: {
      kw: ["자동차", "차", "car", "vehicle", "승용차"],
      desc: `flat vector icon of a car facing left, cyan blue ${CYAN} rounded body with light gray ${GRAY} windows, dark gray ${DARK} wheels with light gray hubs`,
      draw(r) {
        const c = pick(r, [CYAN, RED, YEL]);
        return `<path d="M70 320 Q74 276 116 268 L150 210 Q160 188 186 188 L300 188 Q324 188 338 210 L378 268 Q438 278 434 320 Q432 348 404 348 L98 348 Q72 348 70 320 Z" fill="${c}"/>
          <path d="M172 210 L288 210 Q302 210 310 224 L330 258 L156 258 L168 222 Q170 210 172 210 Z" fill="${GRAY}"/>
          <circle cx="150" cy="356" r="44" fill="${DARK}"/><circle cx="150" cy="356" r="18" fill="${GRAY}"/>
          <circle cx="352" cy="356" r="44" fill="${DARK}"/><circle cx="352" cy="356" r="18" fill="${GRAY}"/>`;
      },
    },
    bicycle: {
      kw: ["자전거", "bicycle", "bike", "바이크"],
      desc: `flat vector icon of a bicycle, two dark gray ${DARK} wheels with light gray ${GRAY} hubs, cyan blue ${CYAN} thick rounded frame strokes, small saddle and handlebar`,
      draw(r) {
        const f = pick(r, [CYAN, RED, LIME]);
        return `<circle cx="140" cy="330" r="86" ${st(DARK, 26)}/>
          <circle cx="372" cy="330" r="86" ${st(DARK, 26)}/>
          <circle cx="140" cy="330" r="14" fill="${GRAY}"/>
          <circle cx="372" cy="330" r="14" fill="${GRAY}"/>
          <path d="M140 330 L216 200 L330 200 L372 330 M216 200 L256 330 L140 330 M256 330 L330 200" ${st(f, 22)}/>
          <path d="M196 186 l44 0" ${st(DARK, 20)}/>
          <path d="M330 200 l-14 -34 l36 -6" ${st(DARK, 18)}/>`;
      },
    },
    umbrella: {
      kw: ["우산", "umbrella", "장마", "비"],
      desc: `flat vector icon of an umbrella, red ${RED} scalloped canopy, light gray ${GRAY} pole with a curved hook handle, one shine mark on the canopy`,
      draw(r) {
        const c = pick(r, [RED, CYAN, YEL]);
        return `<g transform="rotate(${rand(r, -10, 10)} 256 256)">
          <path d="M76 250 A180 180 0 0 1 436 250 Z" fill="${c}"/>
          <path d="M76 250 a45 38 0 0 1 90 0 a45 38 0 0 1 90 0 a45 38 0 0 1 90 0 a45 38 0 0 1 90 0" fill="${c === RED ? DRED : GRAY}" opacity="${c === RED ? 1 : 0.5}"/>
          <path d="M256 250 L256 420 q0 36 -34 36 q-30 0 -30 -30" ${st(GRAY, 20)}/>
          <circle cx="256" cy="66" r="14" fill="${GRAY}"/>
        </g>`;
      },
    },
    flower: {
      kw: ["꽃", "flower", "플라워", "튤립"],
      desc: `flat vector icon of a flower, five purple ${PUR} round petals around a yellow ${YEL} center circle, lime green ${LIME} stem with one leaf`,
      draw(r) {
        const p = pick(r, [PUR, RED, ORA]);
        return `${[0, 72, 144, 216, 288].map((a) => {
            const x = 256 + Math.cos(((a - 90) * Math.PI) / 180) * 92;
            const y = 210 + Math.sin(((a - 90) * Math.PI) / 180) * 92;
            return `<circle cx="${x}" cy="${y}" r="62" fill="${p}"/>`;
          }).join("")}
          <circle cx="256" cy="210" r="52" fill="${YEL}"/>
          <path d="M256 330 L256 452" ${st(LIME, 22)}/>
          <ellipse cx="316" cy="410" rx="48" ry="26" fill="${LIME}" transform="rotate(-28 316 410)"/>`;
      },
    },
    sun: {
      kw: ["해", "태양", "sun", "햇빛"],
      desc: `flat vector icon of a sun, yellow ${YEL} round center with eight orange ${ORA} short ray strokes around, one light gray ${GRAY} curved shine mark`,
      draw(r) {
        return `<circle cx="256" cy="256" r="128" fill="${YEL}"/>
          ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M256 74 l0 44" ${st(ORA, 26)} transform="rotate(${a} 256 256)"/>`).join("")}
          ${shine(198, 210)}`;
      },
    },
    cloud: {
      kw: ["구름", "cloud", "날씨"],
      desc: `flat vector icon of a puffy cloud, light gray ${GRAY} overlapping round lobes, three cyan blue ${CYAN} short rain dashes falling below`,
      draw(r) {
        const rain = r() < 0.7;
        return `<circle cx="180" cy="250" r="80" fill="${GRAY}"/>
          <circle cx="270" cy="204" r="96" fill="${GRAY}"/>
          <circle cx="350" cy="262" r="72" fill="${GRAY}"/>
          <rect x="120" y="252" width="300" height="84" rx="42" fill="${GRAY}"/>
          ${rain ? [0, 1, 2].map((i) => `<path d="M${180 + i * 76} 380 l-14 42" ${st(CYAN, 20)}/>`).join("") : `<circle cx="392" cy="150" r="34" fill="${YEL}"/>`}`;
      },
    },
    book: {
      kw: ["책", "book", "노트", "독서"],
      desc: `flat vector icon of an open book, lime green ${LIME} left page and light gray ${GRAY} right page meeting at the center, short rounded text line strokes on each page`,
      draw(r) {
        const c = pick(r, [LIME, CYAN, RED]);
        return `<path d="M256 140 C 200 108 130 108 88 126 L88 380 C 130 362 200 362 256 394 Z" fill="${c}"/>
          <path d="M256 140 C 312 108 382 108 424 126 L424 380 C 382 362 312 362 256 394 Z" fill="${GRAY}"/>
          <path d="M124 190 q50 -12 88 6 M124 246 q50 -12 88 6 M300 196 q50 -18 88 -6 M300 252 q50 -18 88 -6" ${st(c === GRAY ? MGRAY : "#FFFFFF", 13)} opacity="0.85"/>`;
      },
    },
    pencil: {
      kw: ["연필", "pencil", "펜", "pen", "필기"],
      desc: `flat vector icon of a pencil tilted 45 degrees, yellow ${YEL} rounded body, tan ${TAN} sharpened tip with a dark gray ${DARK} point at the lower left, light gray ${GRAY} band at the top end`,
      draw(r) {
        const c = pick(r, [YEL, RED, CYAN]);
        return `<g transform="rotate(45 256 256)">
          <rect x="196" y="60" width="120" height="300" rx="18" fill="${c}"/>
          <rect x="196" y="60" width="120" height="52" rx="18" fill="${GRAY}"/>
          <path d="M196 360 L316 360 L256 458 Z" fill="${TAN}" stroke-linejoin="round"/>
          <path d="M234 396 L278 396 L256 458 Z" fill="${DARK}" stroke-linejoin="round"/>
        </g>`;
      },
    },
    gift: {
      kw: ["선물", "gift", "present", "기프트", "선물상자"],
      desc: `flat vector icon of a gift box, red ${RED} rounded box with a light gray ${GRAY} vertical ribbon and lid band, round bow with two loops on top`,
      draw(r) {
        const c = pick(r, [RED, CYAN, PUR]);
        return `<rect x="112" y="216" width="288" height="204" rx="22" fill="${c}"/>
          <rect x="96" y="172" width="320" height="64" rx="18" fill="${c === RED ? DRED : c}" opacity="${c === RED ? 1 : 0.82}"/>
          <rect x="232" y="172" width="48" height="248" fill="${GRAY}"/>
          <path d="M256 168 C 196 156 174 104 212 88 C 244 74 256 128 256 162 C 256 128 268 74 300 88 C 338 104 316 156 256 168 Z" fill="${GRAY}"/>`;
      },
    },
  };

  /* ── 추상 폴백 (모티프 미인식 키워드) ── */
  const COMBOS = [
    { main: RED, sub: DRED, name: `red ${RED} with dark red ${DRED}` },
    { main: YEL, sub: ORA, name: `yellow ${YEL} with orange ${ORA}` },
    { main: CYAN, sub: GRAY, name: `cyan blue ${CYAN} with light gray ${GRAY}` },
    { main: LIME, sub: DGRN, name: `lime green ${LIME} with deep green ${DGRN}` },
    { main: TAN, sub: BROWN, name: `tan ${TAN} with brown ${BROWN}` },
    { main: PUR, sub: DPUR, name: `purple ${PUR} with deep purple ${DPUR}` },
  ];

  function abstractDraw(r, combo) {
    const pts = [];
    const n = 8;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const rr = 160 * rand(r, 0.86, 1.14);
      pts.push([256 + Math.cos(a) * rr, 268 + Math.sin(a) * rr]);
    }
    let d = "";
    for (let i = 0; i < n; i++) {
      const nx = pts[(i + 1) % n], m2 = pts[(i + 2) % n];
      const mx = (nx[0] + m2[0]) / 2, my = (nx[1] + m2[1]) / 2;
      if (i === 0) { const p = pts[0], q = pts[1]; d = `M ${(p[0] + q[0]) / 2} ${(p[1] + q[1]) / 2} `; }
      d += `Q ${nx[0]} ${nx[1]} ${mx} ${my} `;
    }
    const hasStem = r() < 0.55;
    return {
      svg: `<path d="${d}Z" fill="${combo.main}"/>
        ${hasStem ? `<path d="M256 122 q-6 -44 28 -60" ${st(LIME, 24)}/>` : ""}
        ${shine(190, 216)}
        <circle cx="300" cy="300" r="16" fill="${GRAY}"/>
        <circle cx="336" cy="264" r="11" fill="${combo.sub}"/>`,
      desc: `chunky rounded blob silhouette${hasStem ? `, short curved lime green ${LIME} stem on top` : ""}, one light gray ${GRAY} curved shine mark and two small round dots`,
    };
  }

  /* ── 키워드 해석 ── */
  function resolve(keyword) {
    const k = keyword.trim().toLowerCase();
    for (const [id, m] of Object.entries(MOTIFS)) {
      if (m.kw.some((w) => k === w.toLowerCase() || k.includes(w.toLowerCase()))) return { type: "motif", id };
    }
    return { type: "abstract" };
  }

  function generate(keyword, seed) {
    const r = rng32(hash(keyword.trim().toLowerCase()) ^ (seed >>> 0));
    const res = resolve(keyword);
    let inner, body;
    if (res.type === "motif") {
      const m = MOTIFS[res.id];
      inner = m.draw(r);
      body = m.desc;
    } else {
      const combo = pick(r, COMBOS);
      const a = abstractDraw(r, combo);
      inner = a.svg;
      body = `flat vector icon of ${keyword}, ${combo.name} color blocking, ${a.desc}`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">\n${inner}\n</svg>`;
    return { svg, body, seed, motif: res.type === "motif" ? res.id : null };
  }

  window.DGG_ENGINE = { generate, resolve, hash, motifCount: Object.keys(MOTIFS).length };
})();
