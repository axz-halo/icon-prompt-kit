// Daum Graphic Generator — 클라이언트 생성 엔진
// 키워드+시드 → 스타일 DNA(공식 팔레트·라운드 블롭·EBEBEB 컷아웃)를 지키는 SVG를 결정론적으로 생성
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

  // 레퍼런스에서 실제로 함께 쓰이는 색 조합 (main, sub, 이름)
  const COMBOS = [
    { main: "#E94B35", sub: "#C23824", name: "red #E94B35 with dark red #C23824" },
    { main: "#F2C500", sub: "#F59D00", name: "yellow #F2C500 with orange #F59D00" },
    { main: "#F59D00", sub: "#F2C500", name: "orange #F59D00 with yellow #F2C500" },
    { main: "#05A9E3", sub: "#EBEBEB", name: "cyan blue #05A9E3 with light gray #EBEBEB" },
    { main: "#8BC02F", sub: "#42A141", name: "lime green #8BC02F with deep green #42A141" },
    { main: "#BF9760", sub: "#8D5836", name: "tan #BF9760 with brown #8D5836" },
    { main: "#9C56B8", sub: "#6D2AB0", name: "purple #9C56B8 with deep purple #6D2AB0" },
    { main: "#EBEBEB", sub: "#BEBEBE", name: "light gray #EBEBEB with mid gray #BEBEBE" },
  ];
  const GRAY = "#EBEBEB";
  const LIME = "#8BC02F";

  // 부드러운 블롭 패스 (원 위 점 + 반경 지터 → 중점 Quadratic 스무딩)
  function blobPath(r, cx, cy, R, n, jitter) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const rr = R * rand(r, 1 - jitter, 1 + jitter);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    let d = "";
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      d += i === 0 ? `M ${mx} ${my} ` : "";
      const nx = pts[(i + 1) % n], m2 = pts[(i + 2) % n];
      const m2x = (nx[0] + m2[0]) / 2, m2y = (nx[1] + m2[1]) / 2;
      d += `Q ${nx[0]} ${nx[1]} ${m2x} ${m2y} `;
    }
    return d + "Z";
  }

  // 메인 실루엣 빌더들 — {svg, desc}
  const BODIES = [
    function blob(r, c) {
      return { svg: `<path d="${blobPath(r, 256, 268, 165, 8, 0.14)}" fill="${c.main}"/>`, desc: "chunky rounded blob silhouette" };
    },
    function roundRect(r, c) {
      const w = rand(r, 250, 310), h = rand(r, 230, 300), rx = rand(r, 40, 70);
      return { svg: `<rect x="${256 - w / 2}" y="${272 - h / 2}" width="${w}" height="${h}" rx="${rx}" fill="${c.main}"/>`, desc: "rounded rectangle body" };
    },
    function circleBody(r, c) {
      return { svg: `<circle cx="256" cy="266" r="${rand(r, 150, 172)}" fill="${c.main}"/>`, desc: "plump round body" };
    },
    function wedge(r, c) {
      return {
        svg: `<g transform="rotate(45 256 256)"><path d="M116 336 A150 150 0 0 1 396 336 Z" fill="${c.sub}"/><path d="M150 336 A116 116 0 0 1 362 336 Z" fill="${c.main}"/></g>`,
        desc: "wedge slice with a thick rind arc, tilted 45 degrees",
      };
    },
    function teardrop(r, c) {
      return {
        svg: `<g transform="rotate(${Math.floor(rand(r, -35, -10))} 256 256)"><path d="M256 96 C 350 170 392 250 380 330 C 368 412 300 448 256 448 C 212 448 144 412 132 330 C 120 250 162 170 256 96 Z" fill="${c.main}"/></g>`,
        desc: "plump teardrop silhouette tilted diagonally",
      };
    },
    function cluster(r, c) {
      const circles = [
        [200, 200, 78, c.main], [312, 210, 70, c.sub], [256, 300, 74, c.main],
        [180, 306, 58, GRAY], [330, 306, 56, c.sub],
      ];
      return {
        svg: circles.map(([x, y, rr, f]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${f}"/>`).join(""),
        desc: "cluster of overlapping circles with one light gray highlight ball",
      };
    },
  ];

  // 토퍼 (상단 장식)
  const TOPPERS = [
    function stemLeaf(r) {
      return {
        svg: `<path d="M256 118 q-6 -46 30 -64" fill="none" stroke="${LIME}" stroke-width="24" stroke-linecap="round"/><ellipse cx="316" cy="52" rx="42" ry="24" fill="${LIME}" transform="rotate(-24 316 52)"/>`,
        desc: "curved lime green #8BC02F stem with one leaf on top",
      };
    },
    function stemOnly(r) {
      return {
        svg: `<path d="M256 122 q-4 -42 26 -58" fill="none" stroke="${LIME}" stroke-width="24" stroke-linecap="round"/>`,
        desc: "short curved lime green #8BC02F stem on top",
      };
    },
    function none() { return { svg: "", desc: "" }; },
    function none2() { return { svg: "", desc: "" }; },
  ];

  // 디테일 (EBEBEB 컷아웃 문법)
  const DETAILS = [
    function shine(r) {
      return { svg: `<path d="M196 208 q-18 34 4 66" fill="none" stroke="${GRAY}" stroke-width="26" stroke-linecap="round"/>`, desc: "one light gray #EBEBEB curved shine mark" };
    },
    function dashes(r) {
      const rows = [];
      for (let i = 0; i < 3; i++) rows.push(`<path d="M${208 + i * 34} ${232 + i * 40} l26 -12" stroke="${GRAY}" stroke-width="22" stroke-linecap="round"/>`);
      return { svg: rows.join(""), desc: "three light gray #EBEBEB short rounded dashes in a diagonal row" };
    },
    function dots(r) {
      const d = [];
      for (let i = 0; i < 3; i++) d.push(`<circle cx="${212 + i * 46}" cy="${260 + (i % 2) * 42 - 20}" r="15" fill="${GRAY}"/>`);
      return { svg: d.join(""), desc: "three light gray #EBEBEB round dots" };
    },
    function band(r) {
      return { svg: `<rect x="166" y="300" width="180" height="26" rx="13" fill="${GRAY}"/>`, desc: "one light gray #EBEBEB horizontal band stripe" };
    },
    function brackets(r) {
      return { svg: `<path d="M222 232 q-14 32 0 62 M292 232 q14 32 0 62" fill="none" stroke="${GRAY}" stroke-width="24" stroke-linecap="round"/>`, desc: "two light gray #EBEBEB curved bracket marks facing each other" };
    },
  ];

  function generate(keyword, seed) {
    const r = rng32(hash(keyword.trim().toLowerCase()) ^ (seed >>> 0));
    const combo = pick(r, COMBOS);
    const body = pick(r, BODIES)(r, combo);
    const topper = pick(r, TOPPERS)(r);
    // 디테일 2개 (중복 없이)
    const idx = [...DETAILS.keys()];
    const d1 = idx.splice(Math.floor(r() * idx.length), 1)[0];
    const d2 = idx.splice(Math.floor(r() * idx.length), 1)[0];
    const det1 = DETAILS[d1](r), det2 = DETAILS[d2](r);
    const tilt = r() < 0.3 ? Math.floor(rand(r, -8, 8)) : 0;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<g transform="rotate(${tilt} 256 256)">
${body.svg}
${topper.svg}
${det1.svg}
${det2.svg}
</g>
</svg>`;

    return {
      svg, combo, seed,
      bodyDesc: body.desc, topperDesc: topper.desc, det1Desc: det1.desc, det2Desc: det2.desc,
    };
  }

  function buildBody(keyword, gen) {
    const parts = [
      `flat vector icon of ${keyword}`,
      `${gen.combo.name} color blocking`,
      gen.bodyDesc,
      gen.topperDesc,
      gen.det1Desc,
      gen.det2Desc,
    ].filter(Boolean);
    return parts.join(", ");
  }

  window.DGG_ENGINE = { generate, buildBody, hash };
})();
