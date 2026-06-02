#!/usr/bin/env bash

SCRIPT_NAME="${0##*/}"

# Set script variable
CONFIG_FILE="worker_config.txt"
using_defaults=false

#Base image -->Default value, overide in CONFIG_FILE
DEFAULT_BASE_DIR="$HOME/sgoinfre/students/stempels/"
BASE_IMG="vm_node_base.vdi"

# VM Configuration
DEFAULT_VM_DIR="$HOME/goinfre/"
VM_NAME="node_$USER"

# Vm config
RAM_MB=2048
VRAM_MB=16
CPUS=2
DISK_SIZE_MB=10240

SSH_PORT="2222"
SSH_HOST="localhost"
VM_USER="root"

#Safeguard
set -euo pipefail

BASE_DIR=""
VM_DIR=""

# Check if VM already exist, if not create it
if VBoxManage list vms | grep $VM_NAME; then 
	echo "VM exist..."
else
	# Get config argument and set default value if missing
	if [ ! -f "$CONFIG_FILE" ]; then
		using_defaults=true
		echo "$CONFIG_FILE not found."
	else
		while IFS='=' read -r key value; do
			case "$key" in
				BASE_DIR) BASE_DIR="$value";;
				VM_DIR) VM_DIR="$value" ;;
			esac
		done < "$CONFIG_FILE"
		if [ -z "$BASE_DIR" ] || [ -z "$VM_DIR" ]; then
			using_defaults=true
			echo "Missing variable in configuration file."
		fi
	fi

	# Prompt for default value usage
	if [ "$using_defaults" = true ]; then
		echo "Using default value:"
		echo "Vm directory: $DEFAULT_VM_DIR\nBase Vm directory: $DEFAULT_VM_DIR"
		BASE_DIR=$DEFAULT_BASE_DIR
		VM_DIR=$DEFAULT_VM_DIR
		read -p "Proceed with these values ? (y/N): " answer
		case "${answer,,}" in
			[y]|[yes]) ;;
			*) echo "Aborted."
				exit 1 ;;
		esac
	fi

	# Validate the values
	if [ ! -d "$BASE_DIR" ] || [ ! -d "$VM_DIR" ];then
		echo "Target directory $BASE_DIR or $VM_DIR does not exist"
		exit 1
	elif [ ! -f $BASE_DIR/$BASE_IMG ];then
		echo "Missing base vm image in $BASE_DIR"
		exit 1
	fi

	echo "VM name: $VM_NAME"
	echo "VM directory: $VM_DIR"

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
fi

# Start VM
echo "Starting VM..."
VBoxManage startvm "$VM_NAME"
#    --type headless
