#!/usr/bin/env bash
set -euo pipefail

NGROK_PID="/tmp/ngrok-n8n.pid"

echo "[1/2] Stopping ngrok tunnel..."
if [ -f "$NGROK_PID" ] && kill -0 "$(cat "$NGROK_PID")" 2>/dev/null; then
  kill "$(cat "$NGROK_PID")" || true
  rm -f "$NGROK_PID"
  echo "  ngrok stopped"
elif pgrep -f "ngrok http" >/dev/null; then
  pkill -f "ngrok http" || true
  rm -f "$NGROK_PID"
  echo "  killed orphan ngrok processes"
else
  rm -f "$NGROK_PID"
  echo "  ngrok not running"
fi

echo "[2/2] Stopping n8n Docker container..."
if ! docker info >/dev/null 2>&1; then
  echo "  Docker daemon not running; nothing to stop"
elif docker ps --format '{{.Names}}' | grep -qx n8n; then
  docker stop n8n >/dev/null
  echo "  n8n stopped"
else
  echo "  n8n already stopped"
fi

echo "Done."
