#!/usr/bin/env python3
"""Daum Graphic Generator — timely-router 로컬 CORS 프록시

라우터(stg)가 브라우저 CORS를 아직 허용하지 않아, 사이트에서 AI 생성을 쓰려면
이 프록시를 로컬에서 실행하고 사이트 ⚙ 패널의 '라우터 주소'를 바꿔주면 된다.

사용법:
  python3 proxy.py                      # http://localhost:8787 에서 실행
  사이트 ⚙ → 라우터 주소: http://localhost:8787/v1 → 저장

API 키는 브라우저가 Authorization 헤더로 보내는 것을 그대로 전달만 하며,
이 프록시는 키를 저장하거나 기록하지 않는다.
"""
import http.server
import json
import urllib.error
import urllib.request

UPSTREAM = "https://router.stg.timelyai.io"
PORT = 8787
PASS_HEADERS = ("Authorization", "Content-Type", "X-Mock", "X-Mock-Tokens", "X-Mock-Delay-Ms")


class Handler(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", ", ".join(PASS_HEADERS))
        self.send_header("Access-Control-Expose-Headers", "X-Provider")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        self._proxy("GET")

    def do_POST(self):
        self._proxy("POST")

    def _proxy(self, method):
        body = None
        if method == "POST":
            n = int(self.headers.get("Content-Length") or 0)
            body = self.rfile.read(n) if n else None
        req = urllib.request.Request(UPSTREAM + self.path, data=body, method=method)
        for h in PASS_HEADERS:
            v = self.headers.get(h)
            if v:
                req.add_header(h, v)
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                data = r.read()
                self._respond(r.status, data, r.headers.get("Content-Type"), r.headers.get("X-Provider"))
        except urllib.error.HTTPError as e:
            self._respond(e.code, e.read(), e.headers.get("Content-Type", "application/json"), None)
        except Exception as e:  # 네트워크 오류 등
            self._respond(502, json.dumps({"error": str(e)}).encode(), "application/json", None)

    def _respond(self, status, data, ctype, provider):
        self.send_response(status)
        self._cors()
        if ctype:
            self.send_header("Content-Type", ctype)
        if provider:
            self.send_header("X-Provider", provider)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):  # 조용히
        pass


if __name__ == "__main__":
    print(f"DGG 프록시 실행 중 → {UPSTREAM}")
    print(f"사이트 ⚙ 라우터 주소에 입력:  http://localhost:{PORT}/v1   (종료: Ctrl+C)")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
