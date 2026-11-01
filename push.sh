#!/usr/bin/env bash
# ==============================================================================
# Midaan Collective — Safe Branch Push Helper
#
# Rules enforced:
# 1. Pushing directly to 'main' or 'master' is strictly prohibited.
# 2. Force pushing (--force / -f) is strictly prohibited.
# 3. Only the current feature/development branch can be pushed.
# 4. Standard non-force, fast-forward push to origin only.
# ==============================================================================

set -euo pipefail

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ -z "$CURRENT_BRANCH" ] || [ "$CURRENT_BRANCH" = "HEAD" ]; then
  echo "❌ [ERROR] Cannot push from a detached HEAD state."
  exit 1
fi

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
  echo "❌ [SECURITY ERROR] Direct push to '$CURRENT_BRANCH' is strictly blocked."
  echo "🛡️ Production branch '$CURRENT_BRANCH' must be updated exclusively via reviewed Pull Requests on GitHub."
  exit 1
fi

# Reject any force flags passed as arguments
for arg in "$@"; do
  if [ "$arg" = "--force" ] || [ "$arg" = "-f" ] || [ "$arg" = "--force-with-lease" ]; then
    echo "❌ [SECURITY ERROR] Force-pushing is strictly disallowed in this repository."
    exit 1
  fi
done

echo "🚀 Safely pushing feature branch '$CURRENT_BRANCH' to origin (fast-forward only)..."
git push -u origin "$CURRENT_BRANCH" "$@"
echo "✅ Branch '$CURRENT_BRANCH' successfully synchronized with origin."
