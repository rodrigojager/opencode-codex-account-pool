#!/usr/bin/env bash
set -euo pipefail

repo="rodrigojager/opencode-codex-account-pool"
ref="${OPENCODE_CODEX_REF:-main}"
data_home="${XDG_DATA_HOME:-$HOME/.local/share}"
install_dir="${OPENCODE_CODEX_PLUGIN_DIR:-$data_home/opencode/plugins/opencode-codex-account-pool}"
archive_url="https://github.com/$repo/archive/refs/heads/$ref.tar.gz"
temp_dir="$(mktemp -d)"
staging_dir="${install_dir}.new.$$"
backup_dir="${install_dir}.old.$$"

cleanup() {
  rm -rf "$temp_dir" "$staging_dir"
}
trap cleanup EXIT

case "$install_dir" in
  ""|/|"$HOME")
    echo "Refusing unsafe install directory: $install_dir" >&2
    exit 1
    ;;
esac

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required to download the plugin." >&2
  exit 1
fi

if ! command -v tar >/dev/null 2>&1; then
  echo "tar is required to extract the plugin." >&2
  exit 1
fi

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun was not found. Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun installation finished, but bun is not available in this shell." >&2
  exit 1
fi

echo "Downloading OpenCode Codex Account Pool..."
curl -fsSL "$archive_url" | tar -xz -C "$temp_dir"
source_dir="$(find "$temp_dir" -mindepth 1 -maxdepth 1 -type d -print -quit)"
if [ -z "$source_dir" ] || [ ! -f "$source_dir/package.json" ]; then
  echo "Downloaded archive does not contain the expected project." >&2
  exit 1
fi

mkdir -p "$(dirname "$install_dir")"
rm -rf "$staging_dir" "$backup_dir"
mv "$source_dir" "$staging_dir"

echo "Preparing plugin files..."
(
  cd "$staging_dir"
  bun install --frozen-lockfile
  bun run build
)

old_moved=0
if [ -e "$install_dir" ]; then
  mv "$install_dir" "$backup_dir"
  old_moved=1
fi
mv "$staging_dir" "$install_dir"

if ! (
  cd "$install_dir"
  bun ./scripts/install.mjs --global
); then
  echo "Plugin registration failed. Restoring the previous installation..." >&2
  rm -rf "$install_dir"
  if [ "$old_moved" -eq 1 ]; then mv "$backup_dir" "$install_dir"; fi
  exit 1
fi

rm -rf "$backup_dir"
echo "Installed at: $install_dir"
echo "Quit every OpenCode process and start it again."
