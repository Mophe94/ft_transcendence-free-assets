profile_swarm_node() {
	profile_standard
	profile_abbrev="node"
	output_format="iso"
	image_ext="iso"
	desc="Minimal alpine.iso for Ft_transcendence VM. \
            For docker swarm deployement."

	arch="x86 x86_64"
	kernel_flavors="virt"
	kernel_addons="zfs"
	initfs_pkgs="base squashfs loop ext4 sd-mod ata cdrom iso9660"

	apks="$apks
                alpine-base
                docker
                openssh
		util-linux
		e2fsprogs
		linux-firmware-none
	"
	modloop_sign=no
	apkovl="genapkovl-swarm_node.sh"
}
