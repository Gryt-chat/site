#!/bin/sh
# Installs the Gryt CLI.
#
#   curl -fsSL https://get.gryt.chat | sh
#
# The whole thing is wrapped in a function that is only called on the last
# line. A truncated download therefore does nothing at all, rather than running
# whichever half of the script arrived — which is the failure mode that makes
# curl-into-a-shell worth being careful about.
#
# Overrides, all optional:
#   GRYT_VERSION      a tag like v1.2.3, default is the newest release
#   GRYT_INSTALL_DIR  where the binary goes, default /usr/local/bin or ~/.local/bin
#
# Source: https://github.com/Gryt-chat/site/blob/main/public/install.sh

set -eu

REPO="Gryt-chat/cli"
BINARY="gryt"

main() {
	need curl
	need tar

	os="$(detect_os)"
	arch="$(detect_arch)"
	dir="$(install_dir)"

	say "Platform: ${os}/${arch}"

	tag="${GRYT_VERSION:-$(latest_tag)}"
	if [ -z "$tag" ]; then
		die "Could not work out the latest release. Set GRYT_VERSION to a tag like v1.0.0 and try again."
	fi
	say "Version:  ${tag}"

	# Asset names come from goreleaser's template, which is not something this
	# script should have to track. Matching os and arch inside the release's
	# own asset list survives a rename; hardcoding the filename would not.
	url="$(asset_url "$tag" "$os" "$arch")"
	if [ -z "$url" ]; then
		die "No ${os}/${arch} archive in ${tag} — the release may not exist. See https://github.com/${REPO}/releases"
	fi

	tmp="$(mktemp -d)"
	# Cleans up on failure too, which matters because the checksum step below
	# is allowed to abort the script.
	trap 'rm -rf "$tmp"' EXIT INT TERM

	archive="${tmp}/$(basename "$url")"
	say "Downloading $(basename "$url")"
	curl -fsSL -o "$archive" "$url"

	verify "$tag" "$archive"

	tar -xzf "$archive" -C "$tmp"

	if [ ! -f "${tmp}/${BINARY}" ]; then
		die "The archive did not contain a ${BINARY} binary."
	fi

	chmod +x "${tmp}/${BINARY}"
	install_binary "${tmp}/${BINARY}" "$dir"

	say ""
	say "Installed ${BINARY} to ${dir}/${BINARY}"

	case ":${PATH}:" in
	*":${dir}:"*) say "Run 'gryt' to get started." ;;
	*)
		say ""
		say "${dir} is not on your PATH. Add it:"
		say "  export PATH=\"${dir}:\$PATH\""
		;;
	esac
}

say() { printf '%s\n' "$1" >&2; }
die() {
	printf 'error: %s\n' "$1" >&2
	exit 1
}

need() {
	command -v "$1" >/dev/null 2>&1 || die "$1 is required and was not found."
}

detect_os() {
	os="$(uname -s)"
	case "$os" in
	Darwin) echo "darwin" ;;
	Linux) echo "linux" ;;
	# The archives for Windows are .zip and there is no shell here to unpack
	# them with, so say so rather than failing further down on a missing tar.
	MINGW* | MSYS* | CYGWIN* | Windows_NT)
		die "Windows is not supported by this script. Download the .zip from https://github.com/${REPO}/releases"
		;;
	*) die "Unsupported operating system: ${os}" ;;
	esac
}

detect_arch() {
	arch="$(uname -m)"
	case "$arch" in
	x86_64 | amd64) echo "amd64" ;;
	arm64 | aarch64) echo "arm64" ;;
	*) die "Unsupported architecture: ${arch}. Builds exist for amd64 and arm64." ;;
	esac
}

install_dir() {
	if [ -n "${GRYT_INSTALL_DIR:-}" ]; then
		echo "$GRYT_INSTALL_DIR"
		return
	fi

	# Only claim /usr/local/bin when it can be written to without sudo. Asking
	# for a password inside a piped script is worse than installing somewhere
	# that needs no password at all.
	if [ -w /usr/local/bin ] 2>/dev/null; then
		echo "/usr/local/bin"
	else
		echo "${HOME}/.local/bin"
	fi
}

api() {
	# GITHUB_TOKEN is honoured only so that repeated runs on a CI box do not
	# trip the unauthenticated rate limit. It is never required.
	if [ -n "${GITHUB_TOKEN:-}" ]; then
		curl -fsSL -H "Authorization: Bearer ${GITHUB_TOKEN}" "$1"
	else
		curl -fsSL "$1"
	fi
}

latest_tag() {
	api "https://api.github.com/repos/${REPO}/releases/latest" |
		sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' |
		head -n1
}

asset_url() {
	tag="$1"
	os="$2"
	arch="$3"

	api "https://api.github.com/repos/${REPO}/releases/tags/${tag}" |
		sed -n 's/.*"browser_download_url"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' |
		while IFS= read -r candidate; do
			name="$(basename "$candidate" | tr '[:upper:]' '[:lower:]')"
			case "$name" in
			*.tar.gz) ;;
			*) continue ;;
			esac
			case "$name" in
			*"${os}"*) ;;
			*) continue ;;
			esac
			case "$name" in
			*"${arch}"*)
				echo "$candidate"
				break
				;;
			esac
		done |
		head -n1
}

verify() {
	tag="$1"
	archive="$2"

	sums_url="$(api "https://api.github.com/repos/${REPO}/releases/tags/${tag}" |
		sed -n 's/.*"browser_download_url"[[:space:]]*:[[:space:]]*"\([^"]*checksums.txt\)".*/\1/p' |
		head -n1)"

	if [ -z "$sums_url" ]; then
		say "warning: ${tag} publishes no checksums.txt, so the download was not verified."
		return
	fi

	if command -v sha256sum >/dev/null 2>&1; then
		actual="$(sha256sum "$archive" | cut -d' ' -f1)"
	elif command -v shasum >/dev/null 2>&1; then
		actual="$(shasum -a 256 "$archive" | cut -d' ' -f1)"
	else
		say "warning: no sha256sum or shasum on this machine, so the download was not verified."
		return
	fi

	expected="$(curl -fsSL "$sums_url" |
		grep " $(basename "$archive")\$" |
		cut -d' ' -f1 |
		head -n1)"

	if [ -z "$expected" ]; then
		say "warning: $(basename "$archive") is not listed in checksums.txt, so it was not verified."
		return
	fi

	if [ "$actual" != "$expected" ]; then
		die "Checksum mismatch. Expected ${expected}, got ${actual}. Not installing."
	fi

	say "Checksum OK"
}

install_binary() {
	src="$1"
	dir="$2"

	if mkdir -p "$dir" 2>/dev/null && [ -w "$dir" ]; then
		mv -f "$src" "${dir}/${BINARY}"
		return
	fi

	if command -v sudo >/dev/null 2>&1; then
		say "${dir} needs elevated permissions."
		sudo mkdir -p "$dir"
		sudo mv -f "$src" "${dir}/${BINARY}"
		return
	fi

	die "Cannot write to ${dir} and sudo is not available. Set GRYT_INSTALL_DIR to somewhere writable."
}

main "$@"
