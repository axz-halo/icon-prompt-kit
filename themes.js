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
      "Chunky rounded blob shapes; every stroke uses stroke-linecap=\"round\"",
      "Color assignment: ONE dominant color (60-80% of area) + neutral gray #EBEBEB/#BEBEBE for secondary parts (handles, legs, straps) + tiny #E94B35 red or brown accents only — multi-color exception for inherently multi-color subjects (burger, pizza)",
      "Small details drawn as thick light-gray #EBEBEB rounded strokes or dots (2-3 details max)",
      "Keep under 20 elements per SVG — reference set averages just 4 shapes per icon",
    ],
  },
};
