#!/usr/bin/env bash

SCRIPT_NAME="${0##*/}"
SSH_PORT="2222"
SSH_HOST="localhost"
VM_USER="root"

# VM Configuration
VM_DIR="/media/stempels/Extreme SSD/ft_transcendence"   # Default VM directory
VM_NAME="vm_node_base"    # Default VM name
BASE_DIR="$HOME/sgoinfre/students/stempels"
BASE_IMG="vm_node_base.vdi"

RAM_MB=2048
VRAM_MB=16
CPUS=2
DISK_SIZE_MB=10240

#Safeguard
set -euo pipefail

if VBoxManage showvminfo "$VM_NAME" >/dev/null 2>&1; then
    echo "[$SCRIPT_NAME] $VM_NAME exist..."
elif [ -f "$VM_DIR/$VM_NAME/$VM_NAME.vbox" ]; then
    echo "[$SCRIPT_NAME] $VM_NAME exist but is not registered. Registering now..."
    VBoxManage registrvm "$VM_DIR/$VM_NAME/$VM_NAME.vbox"
else
    # Create VM
    echo "[$SCRIPT_NAME] Creating $VM_NAME..."
    VBoxManage createvm \
	--name "$VM_NAME" \
	--ostype "Linux_64" \
	--register

    # Configure VM
    echo "[$SCRIPT_NAME] Configuring $VM_NAME..."
    VBoxManage modifyvm "$VM_NAME" \
	--memory "$RAM_MB" \
	--vram "$VRAM_MB" \
	--cpus "$CPUS" \
	--nic1 nat \
	    --natpf1 "ssh,tcp,,2222,,22" \
	    --natpf1 "swarm_management,tcp,,2377,,2377" \
	    --natpf1 "node_communication-TCP,tcp,,7946,,7946" \
	    --natpf1 "node_communication-UDP,udp,,7946,,7946" \
	    --natpf1 "overlay_networks,udp,,4789,,4789" \
	    --paravirtprovider default \
	    --nictype1 virtio \
	    --natdnshostresolver1 on \
	--audio-enabled off \
	--usb off \
	--clipboard bidirectional \
	--draganddrop bidirectional \
	--graphicscontroller vmsvga

    # Boot Order
    VBoxManage modifyvm "$VM_NAME" \
	--boot1 disk \
	--boot2 none  \
	--boot3 none \
	--boot4 none

    if ! VBoxManage showmediuminfo disk "$VM_DIR/$VM_NAME/$VM_NAME.vdi" >/dev/null 2>&1; then
	# Create Disk
	echo "[$SCRIPT_NAME] Creating virtual disk..."
	mkdir -p "$VM_DIR/$VM_NAME"
	VBoxManage createmedium disk \
	    --filename "$VM_DIR/$VM_NAME/$VM_NAME.vdi" \
	    --size "$DISK_SIZE_MB" \
	    --format VDI

	# Attach ISO
	echo "[$SCRIPT_NAME] Attaching Alpine ISO..."
	echo $ISO_FILE

	VBoxManage storageattach "$VM_NAME" \
	    --storagectl "IDE Controller" \
	    --port 0 \
	    --device 0 \
	    --type dvddrive \
	    --medium "$ISO_FILE"

	VBoxManage storagectl "$VM_NAME" \
	    --name "IDE Controller" \
	    --add ide

	VBoxManage modifyvm "$VM_NAME" \
	    --boot2 dvd \

    fi

    # Storage Controllers
    echo "[$SCRIPT_NAME] Adding storage controllers..."
    VBoxManage storagectl "$VM_NAME" \
        --name "SATA Controller" \
        --add sata

    # Attach Disk
    echo "[$SCRIPT_NAME] Attaching disk..."
    VBoxManage storageattach "$VM_NAME" \
        --storagectl "Controller" \
        --port 0 \
        --device 0 \
        --type hdd \
        --medium "$VM_DIR/$VM_NAME/$VM_NAME.vdi"
    #Set scalable GUI
    VBoxManage setextradata "$VM_NAME" \
	    --GUI/SCALEMODE "true"

    # Start VM
    echo "[$SCRIPT_NAME] Starting $VM_NAME..."
    VBoxManage startvm "$VM_NAME"
    #    --type headless

    echo -n "[$SCRIPT_NAME] Waiting for $VM_NAME to stop: "
    while true; do
	state=$(VBoxManage showvminfo "$VM_NAME" --machinereadable \
	| awk -F'"' '/^VMState=/{print $2}')
	if [ "$state" != "running" ]; then
	    break
	fi
	echo -n "."
	sleep 5
    done
    echo "[$SCRIPT_NAME] $VM_NAME exited"
fi

if [ ! -f "$BASE_DIR/$BASE_IMG" ]; then
    echo "[$SCRIPT_NAME] Copying base image to $BASE_DIR"
    mkdir -p "$BASE_DIR"
    chmod 755 "$BASE_DIR"
    VBoxManage clonemedium disk \
	"$VM_DIR/$VM_NAME/$VM_NAME.vdi" \
	"$BASE_DIR/$BASE_IMG"
    chmod 755 "$BASE_DIR/$BASE_IMG"
else
    echo "[$SCRIPT_NAME] $BASE_IMG already exist in $VM_DIR"
fi
