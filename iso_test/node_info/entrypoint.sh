#!/bin/sh

set -eux
export HOSTNAME="swarm_node"

VERSION="latest-stable"
export OUTDIR=/build/image

abuild-keygen -na
export APK_OPTS="--no-script"
export APORTS_DIR=/root/aports
cd /root/aports/scripts
sh "./mkimage.sh" \
	--tag "$VERSION" \
	--outdir "$OUTDIR" \
        --arch x86_64 \
	--repository https://dl-cdn.alpinelinux.org/alpine/$VERSION/main \
	--repository https://dl-cdn.alpinelinux.org/alpine/$VERSION/community \
	--profile swarm_node
