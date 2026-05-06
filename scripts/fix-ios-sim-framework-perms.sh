#!/usr/bin/env bash
set -euo pipefail

# CoreSimulator may install frameworks with 0644 permissions, which can break dyld loading
# for vendored dynamic frameworks (e.g. Agora). This script makes Mach-O framework binaries
# executable inside the currently booted simulator app bundle.

BUNDLE_ID="${1:-org.reactjs.native.example.MdTelemed}"

APP_PATH="$(xcrun simctl get_app_container booted "$BUNDLE_ID" app 2>/dev/null || true)"
if [[ -z "${APP_PATH}" || ! -d "${APP_PATH}" ]]; then
  echo "Could not locate app container for ${BUNDLE_ID} on booted simulator."
  echo "Install the app first, then re-run."
  exit 1
fi

FRAMEWORKS_DIR="${APP_PATH}/Frameworks"
if [[ ! -d "${FRAMEWORKS_DIR}" ]]; then
  echo "No Frameworks directory at: ${FRAMEWORKS_DIR}"
  exit 0
fi

changed=0
while IFS= read -r -d '' f; do
  # Only touch Mach-O binaries
  if file "$f" | grep -q "Mach-O"; then
    chmod +x "$f" || true
    changed=$((changed+1))
  fi
done < <(find "${FRAMEWORKS_DIR}" -maxdepth 2 -type f -print0)

echo "Updated executable bit on ${changed} Mach-O framework binaries."

