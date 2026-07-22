// Vercel 서버리스 프록시 — 같은 출처 /v1/* 를 timely 라우터로 중계
// 사이트와 API가 한 출처가 되므로 브라우저 CORS 문제가 아예 발생하지 않는다.
// API 키는 Vercel 환경변수 TIMELY_API_KEY에만 존재 (클라이언트/저장소 노출 없음).
const UPSTREAM = "https://router.stg.timelyai.io";

export default async function handler(req, res) {
  const p = (req.query && req.query.p) || "chat/completions";
  const url = `${UPSTREAM}/v1/${p}`;
  const headers = { "content-type": req.headers["content-type"] || "application/json" };
  headers["authorization"] = req.headers["authorization"] || `Bearer ${process.env.TIMELY_API_KEY || ""}`;
  for (const h of ["x-mock", "x-mock-tokens", "x-mock-delay-ms"]) {
    if (req.headers[h]) headers[h] = req.headers[h];
  }
  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers,
      body: req.method === "POST" && req.body ? JSON.stringify(req.body) : undefined,
    });
    res.status(upstream.status);
    const xp = upstream.headers.get("x-provider");
    if (xp) res.setHeader("X-Provider", xp);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
}
