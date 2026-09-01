#!/usr/bin/env bash
#
# Refuse to commit an unencrypted vault. This repository is public, so the
# difference between ciphertext and plaintext here is the difference between a
# safe commit and a credential leak.
#
# Install:
#   ln -sf ../../deploy/scripts/vault-guard.sh .git/hooks/pre-commit

set -euo pipefail

status=0
while IFS= read -r file; do
	[ -n "$file" ] || continue
	if ! git show ":$file" 2>/dev/null | head -1 | grep -q '^\$ANSIBLE_VAULT'; then
		echo "!! $file is staged unencrypted." >&2
		echo "   ansible-vault encrypt $file" >&2
		status=1
	fi
done < <(git diff --cached --name-only --diff-filter=ACM | grep -E '(^|/)vault\.ya?ml$' || true)

exit $status
