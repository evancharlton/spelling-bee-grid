#!/usr/bin/env bash

OUT="spelling-bee-grid.zip"

rm "$OUT"

set -e

zip -rj "$OUT" crx/*