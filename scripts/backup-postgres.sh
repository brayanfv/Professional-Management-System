#!/usr/bin/env bash

set -Eeuo pipefail
umask 077

require_environment() {
  local variable_name="$1"
  if [[ -z "${!variable_name:-}" ]]; then
    echo "${variable_name} must be set" >&2
    exit 1
  fi
}

require_environment PGHOST
require_environment PGPORT
require_environment PGDATABASE
require_environment PGUSER
require_environment BACKUP_DIR

mkdir -p "$BACKUP_DIR"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_file="${BACKUP_DIR%/}/${PGDATABASE}-${timestamp}.dump"

pg_dump \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="$backup_file" \
  "$PGDATABASE"

sha256sum "$backup_file" > "${backup_file}.sha256"

echo "Backup created: ${backup_file}"
echo "Checksum created: ${backup_file}.sha256"
