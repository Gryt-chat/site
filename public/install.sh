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
MARKER="# added by the gryt installer (https://get.gryt.chat)"

main() {
	need curl
	need tar

	os="$(detect_os)"
	arch="$(detect_arch)"
	dir="$(install_dir)"

	say "Platform: ${os}/${arch}"

	# Labelled, because GRYT_VERSION is easy to set and have ignored:
	# `GRYT_VERSION=v1.2.3 curl … | sh` sets it for curl rather than for the
	# shell running this, so the pin is dropped and the newest release is
	# installed instead. Nothing here can tell the two cases apart, since an
	# unset variable looks the same either way. Saying which one this is at
	# least makes the mismatch visible to somebody who meant to pin.
	if [ -n "${GRYT_VERSION:-}" ]; then
		tag="$GRYT_VERSION"
		label=" (requested)"
	else
		tag="$(latest_tag)"
		label=" (newest release)"
	fi
	if [ -z "$tag" ]; then
		die "Could not work out the latest release. Set GRYT_VERSION to a tag like v1.0.0 and try again."
	fi
	say "Version:  ${tag}${label}"

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
	*":${dir}:"*)
		say "Run 'gryt' to get started."
		return
		;;
	esac

	ensure_path "$dir"
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

# Written in the syntax of the shell the user actually uses, which is not the
# shell running this script.
path_line() {
	case "$(basename "${SHELL:-sh}")" in
	fish) printf 'fish_add_path "%s"\n' "$1" ;;
	*) printf 'export PATH="%s:$PATH"\n' "$1" ;;
	esac
}

shell_rc() {
	case "$(basename "${SHELL:-sh}")" in
	zsh) echo "${ZDOTDIR:-$HOME}/.zshrc" ;;
	bash)
		# macOS Terminal opens login shells, which read .bash_profile and never
		# .bashrc. Linux interactive shells are the other way round.
		if [ "$(uname -s)" = "Darwin" ]; then
			echo "${HOME}/.bash_profile"
		else
			echo "${HOME}/.bashrc"
		fi
		;;
	fish) echo "${XDG_CONFIG_HOME:-$HOME/.config}/fish/config.fish" ;;
	*) echo "" ;;
	esac
}

print_path_line() {
	say ""
	say "$1 is not on your PATH. Add it:"
	say "  $(path_line "$1")"
}

# On a stock macOS /usr/local/bin is root-owned, so the ~/.local/bin fallback is
# the normal outcome rather than the exception, and nothing on a default macOS
# puts that directory on PATH. Printing a line and hoping produced exactly what
# you would expect: a successful install followed by "command not found".
#
# There is no way to ask first. Under `curl | sh` this script owns stdin, and
# reading /dev/tty instead breaks every non-interactive use. So it is opt-out,
# and it says precisely which file it touched.
ensure_path() {
	dir="$1"

	if [ -n "${GRYT_NO_MODIFY_PATH:-}" ] || [ -n "${GRYT_INSTALL_DIR:-}" ]; then
		# Somebody who picked the location, or asked to be left alone, manages
		# their own PATH.
		print_path_line "$dir"
		return
	fi

	rc="$(shell_rc)"
	if [ -z "$rc" ]; then
		print_path_line "$dir"
		return
	fi

	# Matching the directory rather than the marker, so a line somebody added
	# by hand also counts and this never appends a second one.
	if [ -f "$rc" ] && grep -qF "$dir" "$rc"; then
		say ""
		say "${rc} already puts ${dir} on your PATH, but this shell predates it."
		say "Open a new shell, or run:"
		say "  $(path_line "$dir")"
		return
	fi

	if ! mkdir -p "$(dirname "$rc")" 2>/dev/null ||
		! printf '\n%s\n%s\n' "$MARKER" "$(path_line "$dir")" >>"$rc" 2>/dev/null; then
		print_path_line "$dir"
		return
	fi

	say ""
	say "Added ${dir} to your PATH in ${rc}."
	say "That applies to new shells. For this one:"
	say "  $(path_line "$dir")"
	say ""
	say "Set GRYT_NO_MODIFY_PATH=1 to skip this next time."
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
