#!/bin/bash
# Daum Graphic Generator — 더블클릭 실행기 (macOS)
# 처음 한 번만 API 키를 물어보고, 이후에는 바로 서버를 띄우고 브라우저를 엽니다.
cd "$(dirname "$0")" || exit 1

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3가 필요합니다. 터미널에서 'xcode-select --install' 실행 후 다시 시도하세요."
  read -r -p "엔터를 누르면 닫힙니다..."
  exit 1
fi

if [ ! -s timely.key ]; then
  echo "── 최초 1회 설정 ─────────────────────────────"
  echo "timely 라우터 API 키를 붙여넣고 엔터 (tk_...:sk_... 형식)"
  echo "발급: https://stg.timelyai.io/upstage → 설정 → 기능 → 타임리 라우터"
  read -r KEY
  if [ -z "$KEY" ]; then
    echo "키가 비어 있어요. AI 생성 없이 로컬 엔진만 사용됩니다. (나중에 다시 실행하면 재설정)"
  else
    printf '%s' "$KEY" > timely.key
    chmod 600 timely.key
    echo "저장됨 → timely.key (git에 커밋되지 않습니다)"
  fi
fi

# 이미 떠 있으면 브라우저만 연다
if curl -s -m 1 -o /dev/null http://localhost:8787/; then
  echo "이미 실행 중 — 브라우저를 엽니다."
  open http://localhost:8787
  exit 0
fi

( sleep 1.5; open http://localhost:8787 ) &
exec python3 proxy.py
