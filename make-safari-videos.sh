#!/bin/bash
# Makes the transparent .mov files that Safari / iPhone need (HEVC with alpha).
# Run ONCE on your Mac, from this folder:   bash make-safari-videos.sh
# Needs ffmpeg:  brew install ffmpeg   (version 6.1 or newer)
set -e
cd "$(dirname "$0")/assets/logos"

for name in records productions media; do
  echo "Converting $name.webm -> $name.mov ..."
  ffmpeg -y -loglevel error \
    -c:v libvpx-vp9 -i "$name.webm" \
    -vf format=bgra \
    -c:v hevc_videotoolbox -alpha_quality 0.9 -b:v 12M -allow_sw 1 -tag:v hvc1 \
    -an "$name.mov"
done
echo "Done. Reload the page in Safari."
