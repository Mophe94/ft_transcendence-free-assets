profile_swarm_node() {
#	profile_standard
	profile_abbrev="node"
	output_format="iso"
	image_ext="iso"
	boot_syslinux=true
	bootloader="syslinux"
	efi_arch=""
	desc="Minimal alpine.iso for Ft_transcendence VM. \
            For docker swarm deployement."

	arch="x86_64"
	kernel_flavors="virt"
	kernel_addons="zfs"
	initfs_pkgs="base squashfs loop ext4 sd-mod ata cdrom iso9660"

	apks="$apks
                alpine-base
		util-linux
                docker
                openssh
		e2fsprogs
		linux-firmware-none
	"
	modloop_sign=no
	apkovl="genapkovl-swarm_node.sh"
}
