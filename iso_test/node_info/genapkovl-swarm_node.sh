#!/bin/sh -e

cleanup() {
	rm -rf "$tmp"
}

makefile() {
	OWNER="$1"
	PERMS="$2"
	FILENAME="$3"
	cat > "$FILENAME"
	chown "$OWNER" "$FILENAME"
	chmod "$PERMS" "$FILENAME"
}

rc_add() {
	mkdir -p "$tmp"/etc/runlevels/"$2"
	ln -sf /etc/init.d/"$1" "$tmp"/etc/runlevels/"$2"/"$1"
}

tmp="$(mktemp -d)"
trap cleanup exit

mkdir -p "$tmp"/etc
mkdir -p "$tmp"/etc/apk
#mkdir -p "$tmp"/etc/network
mkdir -p "$tmp"/etc/local.d
mkdir -p "$tmp"/root

makefile root:root 0644 "$tmp"/etc/hostname <<EOF
$HOSTNAME
EOF

cp /build/answerfile "$tmp"/root/answerfile
cp /build/autoinstall.start "$tmp"/local.d/
chmod +x "$tmp"/local.d/autoinstall.start

makefile root:root 0644 "$tmp"/etc/apk/world <<EOF
alpine-base
docker
openssh
EOF

makefile root:root 0755 "$tmp"/etc/inittab <<EOF
# /etc/inittab

::sysinit:/sbin/openrc sysinit
::sysinit:/sbin/openrc boot
::wait:/sbin/openrc default

tty1::respawn:/bin/login -f root tty1 </dev/tty1 >/dev/tty1 2>&1

EOF

makefile root:root 0644 "$tmp"/etc/ssh/sshd_config <<EOF
PermitRootLogin yes
PasswordAuthentication yes
UseDNS no
Subsystem sftp /usr/lib/ssh/sftp-server
EOF

makefile root:root 0644 "$tmp"/etc/motd <<EOF
Welcome to the Swarm!
EOF

rc_add alpine-base boot
rc_add docker boot
rc_add sshd boot
EOF
tar -c -C "$tmp" etc | gzip -9n > $HOSTNAME.apkovl.tar.gz
