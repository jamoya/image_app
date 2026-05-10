#!/usr/bin/env bash
set -euo pipefail

NGROK_DOMAIN="unboggy-nonignitible-maira.ngrok-free.dev"
N8N_PORT="5678"
NGROK_LOG="/tmp/ngrok-n8n.log"
NGROK_PID="/tmp/ngrok-n8n.pid"

echo "[1/3] Starting n8n Docker container..."
if ! docker info >/dev/null 2>&1; then
  echo "ERROR: Docker daemon is not running. Start Docker Desktop and retry." >&2
  exit 1
fi

if ! docker ps -a --format '{{.Names}}' | grep -qx n8n; then
  echo "ERROR: Container 'n8n' does not exist." >&2
  exit 1
fi

if docker ps --format '{{.Names}}' | grep -qx n8n; then
  echo "  n8n already running"
else
  docker start n8n >/dev/null
  echo "  n8n started"
fi

echo "[2/3] Waiting for n8n on http://localhost:${N8N_PORT}..."
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:${N8N_PORT}/" || echo "000")
  if [ "$code" = "200" ]; then
    echo "  n8n is responding"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "ERROR: n8n did not respond within 30s" >&2
    exit 1
  fi
  sleep 1
done

echo "[3/3] Starting ngrok tunnel to https://${NGROK_DOMAIN}..."
if [ -f "$NGROK_PID" ] && kill -0 "$(cat "$NGROK_PID")" 2>/dev/null; then
  echo "  ngrok already running (pid $(cat "$NGROK_PID"))"
else
  if pgrep -f "ngrok http" >/dev/null; then
    echo "  killing orphan ngrok processes..."
    pkill -f "ngrok http" || true
    sleep 2
  fi
  nohup ngrok http --url="https://${NGROK_DOMAIN}" "${N8N_PORT}" \
    --log=stdout --log-level=info > "$NGROK_LOG" 2>&1 < /dev/null &
  echo $! > "$NGROK_PID"
  echo "  ngrok started (pid $(cat "$NGROK_PID"))"
fi

echo "Verifying tunnel..."
for i in $(seq 1 15); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://${NGROK_DOMAIN}/" || echo "000")
  if [ "$code" = "200" ]; then
    echo "  tunnel ok (HTTP 200)"
    echo
    echo "All services running:"
    echo "  n8n        http://localhost:${N8N_PORT}"
    echo "  public URL https://${NGROK_DOMAIN}"
    echo "  ngrok log  ${NGROK_LOG}"
    exit 0
  fi
  sleep 1
done

echo "ERROR: tunnel did not respond. Check ${NGROK_LOG}" >&2
exit 1
