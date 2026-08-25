#!/usr/bin/env bash

set -Eeuo pipefail

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
require_environment BACKUP_FILE
require_environment RESTORE_CONFIRMATION

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "BACKUP_FILE does not exist: ${BACKUP_FILE}" >&2
  exit 1
fi

checksum_file="${BACKUP_FILE}.sha256"
if [[ ! -f "$checksum_file" ]]; then
  echo "Checksum file does not exist: ${checksum_file}" >&2
  exit 1
fi

expected_confirmation="RESTORE:${PGHOST}:${PGPORT}:${PGDATABASE}"
if [[ "$RESTORE_CONFIRMATION" != "$expected_confirmation" ]]; then
  echo "Set RESTORE_CONFIRMATION=${expected_confirmation} to restore this explicit target" >&2
  exit 1
fi

sha256sum --check "$checksum_file"

pg_restore \
  --clean \
  --if-exists \
  --exit-on-error \
  --no-owner \
  --no-privileges \
  --dbname="$PGDATABASE" \
  "$BACKUP_FILE"

echo "Restore completed for ${PGHOST}:${PGPORT}/${PGDATABASE}"
