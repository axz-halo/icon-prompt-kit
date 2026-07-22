// Daum Graphic Generator — 테마 정의
// 테마 = 팔레트 + 마스터 프롬프트(미드저니/힉스필드 코어) + AI 생성 규칙
// 사이트의 "테마" 패널에서 코어를 편집하면 이 기본값 위에 브라우저별로 덮어써진다.
window.DGG_THEMES = {
  A: {
    id: "A",
    name: "Theme A · Flat Basic (기초 그래픽 75종)",
    draft: false,
    localEngine: true, // 로컬 모티프 엔진이 이 테마 전용
    palette: ["#E94B35", "#C23824", "#F2C500", "#F59D00", "#8BC02F", "#42A141", "#EBEBEB", "#BEBEBE", "#323232", "#8D5836", "#BF9760", "#9C56B8", "#6D2AB0", "#05A9E3"],
    // 75종 SVG 실측: 아이콘당 색 2~3(최대 5) · 도형 4±2개 · 디테일은 스트로크가 아닌 라운드 필 패스
    coreMJ: window.DGG_DATA.CORE_MJ,
    coreHF: window.DGG_DATA.CORE_HF,
    aiRules: [
      "Flat vector only: solid fills, NO gradients, NO shadows, NO outlines/borders, NO text",
      "Chunky rounded blob shapes; every stroke uses stroke-linecap=\"round\"; 2-3 colors per icon",
      "Small details drawn as thick light-gray #EBEBEB rounded strokes or dots (2-3 details max)",
      "Keep under 20 elements per SVG — reference set averages just 4 shapes per icon",
    ],
  },
  B: {
    id: "B",
    name: "Theme B · Toss Soft 3D (추정 초안)",
    draft: true, // 공개 아티클 기반 추정 — 원본 자산 확보 시 정밀 추출로 교체
    localEngine: false,
    palette: ["#3182F6", "#1B64DA", "#4593FC", "#B0D3FF", "#E8F1FF", "#FFD331", "#FFA938", "#FF6B6B", "#17DA85", "#0E1B2C", "#FFFFFF"],
    coreMJ: ", soft 3D rendered icon, smooth rounded plastic-like geometry, matte material with subtle gradients, gentle studio lighting from upper left, slight three-quarter isometric view, minimal Korean fintech app illustration style, single floating object, isolated on pure white background, centered, fills the frame --ar 1:1 --v 7 --style raw --s 100 --no outline, text, watermark, photo, realistic, hands, background objects",
    coreHF: ", rendered as a soft 3D icon: smooth rounded geometry, matte plastic material, subtle gradients allowed, gentle upper-left studio lighting, slight three-quarter view, clean minimal fintech illustration, single floating object on a pure white empty background, subject centered and filling the frame",
    aiRules: [
      "Soft-3D look faked in flat SVG: rounded geometry, each surface split into 2-3 tints of the same hue to suggest gentle top-left lighting",
      "No outlines, no text; subtle tone steps instead of hard shadows",
      "Blue-first palette; keep forms plump and friendly",
      "Keep under 40 elements per SVG",
    ],
  },
};
