#!/usr/bin/env bash

SCRIPT_NAME="${0##*/}"
SSH_PORT="2222"
SSH_HOST="localhost"
VM_USER="root"

#Base image
BASE_DIR="$HOME/sgoinfre"
BASE_IMG="vm_node_base.vdi"

# VM Configuration
VM_DIR="$HOME/goinfre/"
VM_NAME="node_$USER"

RAM_MB=2048
VRAM_MB=16
CPUS=2
DISK_SIZE_MB=10240

#Safeguard
set -euo pipefail

echo "VM name: $VM_NAME"
echo "VM directory: $VM_DIR"

if ! VBoxManage list vms | grep $VM_NAME; then 
    # Create VM
    echo "Creating VM..."
    VBoxManage createvm \
	--name "$VM_NAME" \
	--register

    # Configure VM
    echo "Configuring VM..."
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

    # Create Disk
    echo "Creating virtual disk..."
    mkdir -p "$VM_DIR/$VM_NAME"
    VBoxManage clonemedium disk \
	"$BASE_DIR/$BASE_IMG" \
	"$VM_DIR/$VM_NAME/$VM_NAME.vdi"

    # Storage Controllers
    echo "Adding storage controllers..."
    VBoxManage storagectl "$VM_NAME" \
	--name "SATA Controller" \
	--add sata

    echo "Attaching disk..."
    VBoxManage storageattach "$VM_NAME" \
	--storagectl "SATA Controller" \
	--port 0 \
	--device 0 \
	--type hdd \
	--medium "$VM_DIR/$VM_NAME/$VM_NAME.vdi"

    # Boot Order
    VBoxManage modifyvm "$VM_NAME" \
	--boot1 disk \
	--boot2 none \
	--boot3 none \
	--boot4 none

    # Set scalable GUI
    VBoxManage setextradata "$VM_NAME" \
	    --GUI/SCALEMODE "true"
    else
	echo "VM exist..."

fi

# Start VM
echo "Starting VM..."
VBoxManage startvm "$VM_NAME"
#    --type headless
