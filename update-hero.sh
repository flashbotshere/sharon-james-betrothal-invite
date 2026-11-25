#!/usr/bin/env bash
# update-v5.sh — readable hero text + seamless edge below the photo
set -euo pipefail
if [ ! -f lib/config.js ] || [ ! -d components ]; then
  echo "Run this from inside the betrothal-invite project folder."; exit 1
fi

# remove the "Scroll" strip under the card
sed -i.bak '/className="hero-cue"/,/<\/a>/d' components/Invitation.jsx && rm -f components/Invitation.jsx.bak

# CSS fixes (safe to re-run)
sed -i.bak '/\/\* === v5 === \*\//,$d' app/globals.css && rm -f app/globals.css.bak
cat >> app/globals.css <<'EOF'
/* === v5 === */

/* photo flows straight into the cream section — no white band */
.hero { background: var(--tint); padding-bottom: 0; }
.hero-cue { display: none; }
@media (max-width: 700px) {
  .hero { padding: 0; }
  #details { padding-top: 64px; }
}

/* text always readable on any photo */
.hero-fade {
  height: 74%;
  background: linear-gradient(180deg,
    rgba(248, 245, 240, 0.96) 0%,
    rgba(248, 245, 240, 0.92) 48%,
    rgba(248, 245, 240, 0.6) 70%,
    rgba(248, 245, 240, 0) 100%);
}
.hero-text { text-shadow: 0 0 14px rgba(251, 248, 242, 0.9), 0 0 3px rgba(251, 248, 242, 0.7); }
.hero-names { color: #1c1815; }
.hero-date, .hero-venue { color: #26211d; }
.hero-venue { font-weight: 500; }
.hero-kicker, .hero-place { color: #3d3630; }
EOF

echo "✅ v5 applied. Refresh the page."