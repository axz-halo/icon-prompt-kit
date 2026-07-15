#!/usr/bin/env python3
"""Daum Graphic Generator — 로컬 실행기 (사이트 서빙 + timely-router CORS 프록시)

라우터(stg)가 브라우저 CORS를 아직 허용하지 않아, 이 스크립트가
① 갤러리 사이트를 http://localhost:8787 에서 서빙하고
② /v1/* 요청을 라우터로 그대로 전달(CORS 문제 자체가 사라짐)한다.

사용법:
  python3 proxy.py        # 실행 후 브라우저에서 http://localhost:8787 열기
  (같은 출처라 라우터 주소 설정 불필요 — 키만 ⚙ 또는 #k= 링크로 넣으면 끝)

API 키는 브라우저가 Authorization 헤더로 보내는 것을 그대로 전달만 하며,
이 프록시는 키를 저장하거나 기록하지 않는다.
"""
import http.server
import json
import mimetypes
import os
import urllib.error
import urllib.request

UPSTREAM = "https://router.stg.timelyai.io"
PORT = 8787
ROOT = os.path.dirname(os.path.abspath(__file__))
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
        if self.path.startswith("/v1/") or self.path == "/health":
            self._proxy("GET")
        else:
            self._static()

    def do_POST(self):
        self._proxy("POST")

    def _static(self):
        # 사이트 정적 파일 서빙 (쿼리/프래그먼트 제거, 디렉터리 탈출 방지)
        path = self.path.split("?")[0].split("#")[0]
        if path in ("", "/"):
            path = "/index.html"
        full = os.path.normpath(os.path.join(ROOT, path.lstrip("/")))
        if not full.startswith(ROOT) or not os.path.isfile(full):
            self._respond(404, b"not found", "text/plain", None)
            return
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "image/svg+xml"):
            ctype += "; charset=utf-8"
        with open(full, "rb") as f:
            self._respond(200, f.read(), ctype, None)

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
    mimetypes.add_type("image/svg+xml", ".svg")
    print(f"Daum Graphic Generator 로컬 실행 중 (라우터 프록시 포함 → {UPSTREAM})")
    print(f"브라우저에서 여세요:  http://localhost:{PORT}   (종료: Ctrl+C)")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
