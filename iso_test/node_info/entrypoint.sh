#!/bin/sh

set -e
export HOSTNAME="swarm_node"
ln -s vmlinuz-lts /boot/vmlinuz

VERSION="latest-stable"
export OUTDIR=/build/image

abuild-keygen -na
export APK_OPTS="--no-script"
sh "/src/aports/scripts/mkimage.sh" \
	--tag "$VERSION" \
	--outdir "$OUTDIR" \
        --arch x86_64 \
	--repository https://dl-cdn.alpinelinux.org/alpine/$VERSION/main \
	--repository https://dl-cdn.alpinelinux.org/alpine/$VERSION/community \
	--profile swarm_node
