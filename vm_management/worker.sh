#! /bin/bash

SCRIPT_NAME="${0##*/}"

# Set script variable
CONFIG_FILE="worker_config.txt"
using_defaults=false

#Base image -->Default value, overide in CONFIG_FILE
DEFAULT_BASE_DIR="$HOME/sgoinfre/students/stempels/"
BASE_IMG="vm_node_base.vdi"

# VM Configuration
DEFAULT_VM_DIR="$HOME/goinfre/"

# Vm config
RAM_MB=2048
VRAM_MB=16
CPUS=2
DISK_SIZE_MB=10240

SSH_PORT="2222"
SSH_HOST="localhost"
VM_USER="$USER"
VM_TARGET_DIR="/home/$USER"

#Safeguard
set -euo pipefail

wait_for_ssh() {
    TIMEOUT=120
    INTERVAL=2
    ELAPSED=0
    echo "[$SCRIPT_NAME] Waiting for VM to boot"
    while ! ssh \
	-o ControlMaster=auto \
	-o ControlPath=~/.ssh/cm-%r@%h:%p \
	-o ControlPersist=5m \
	-p "$SSH_PORT" "$VM_USER"@"$SSH_HOST" true 2>/dev/null; do
	sleep $INTERVAL
	ELAPSED=$((ELAPSED + INTERVAL))
	if [ $ELAPSED -ge $TIMEOUT ]; then
		echo "SSH not ready after ${TIMEOUT}s"
		exit 1
	fi
    done
}

BASE_DIR=""
VM_DIR=""

# Define role of VM
if [ $# -eq 2 ]; then
    if [ "$1" == "manager" ] || [ "$1" == "worker" ]; then
	TYPE="${1,,}"
    else
	echo "[$SCRIPT_NAME] invalid argument '$1'"
	exit 1
    fi
    IP="$2"
else
    echo "[$SCRIPT_NAME] invalid argument."
    exit 1
fi

VM_NAME="${TYPE}_node_${USER}"

# Check if VM already run, exist, if not create it
if VBoxManage showvminfo "$VM_NAME" --machinereadable 2>&1 | grep -q '^VMState="running"'; then
    wait_for_ssh
elif VBoxManage showvminfo "$VM_NAME" >/dev/null 2>&1; then
    echo "[$SCRIPT_NAME] $VM_NAME exist..."
    # Start VM
    echo "[$SCRIPT_NAME] Starting VM..."
    VBoxManage startvm "$VM_NAME" --type headless
    wait_for_ssh
elif [ -f "$VM_DIR/$VM_NAME/$VM_NAME.vbox" ]; then
    echo "[$SCRIPT_NAME] $VM_NAME exist but is not registered. Registering now..."
    VBoxManage registrvm "$VM_DIR/$VM_NAME/$VM_NAME.vbox"
    # Start VM
    echo "[$SCRIPT_NAME] Starting VM..."
    VBoxManage startvm "$VM_NAME" --type headless
    wait_for_ssh
else
	VM_USER="root"
	# Get config argument and set default value if missing
	if [ ! -f "$CONFIG_FILE" ]; then
		using_defaults=true
		echo "[$SCRIPT_NAME] $CONFIG_FILE not found."
	else
		while IFS='=' read -r key value; do
			case "$key" in
				BASE_DIR) BASE_DIR="$value";;
				VM_DIR) VM_DIR="$value" ;;
			esac
		done < "$CONFIG_FILE"
		if [ -z "$BASE_DIR" ] || [ -z "$VM_DIR" ]; then
			using_defaults=true
			echo "[$SCRIPT_NAME] variable in configuration file."
		fi
	fi

	# Prompt for default value usage
	if [ "$using_defaults" ]; then
		echo "[$SCRIPT_NAME] default value:"
		echo -e "\tdirectory: $DEFAULT_VM_DIR\tBase Vm directory: $BASE_DIR"
		BASE_DIR=$DEFAULT_BASE_DIR
		VM_DIR=$DEFAULT_VM_DIR
		read -p " Proceed with these values ? (y/N): " answer
		case "${answer,,}" in
			[y]|[yes]) ;;
			*) echo "[$SCRIPT_NAME] Aborted."
				exit 1 ;;
		esac
	fi

	# Validate the values
	if [ ! -d "$BASE_DIR" ] || [ ! -d "$VM_DIR" ];then
		echo "[$SCRIPT_NAME] directory $BASE_DIR or $VM_DIR does not exist"
		exit 1
	elif [ ! -f $BASE_DIR/$BASE_IMG ];then
		echo "[$SCRIPT_NAME] base vm image in $BASE_DIR"
		exit 1
	fi

	echo "[$SCRIPT_NAME] name: $VM_NAME"
	echo "[$SCRIPT_NAME] directory: $VM_DIR"

    # Create VM
    echo "[$SCRIPT_NAME] Creating VM..."
    VBoxManage createvm \
	--name "$VM_NAME" \
	--register

    # Configure VM
    echo "[$SCRIPT_NAME] Configuring VM..."
    VBoxManage modifyvm "$VM_NAME" \
	--memory "$RAM_MB" \
	--vram "$VRAM_MB" \
	--cpus "$CPUS" \
	--nic1 nat \
	    --natpf1 "http,tcp,,8080,,80" \
	    --natpf1 "https,tcp,,8443,,443" \
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
    echo "[$SCRIPT_NAME] Creating virtual disk..."
    mkdir -p "$VM_DIR/$VM_NAME"
    VBoxManage clonemedium disk \
	"$BASE_DIR/$BASE_IMG" \
	"$VM_DIR/$VM_NAME/$VM_NAME.vdi"

    # Storage Controllers
    echo "[$SCRIPT_NAME] Adding storage controllers..."
    VBoxManage storagectl "$VM_NAME" \
	--name "SATA Controller" \
	--add sata

    echo "[$SCRIPT_NAME] Attaching disk..."
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

    # Start VM
    echo "[$SCRIPT_NAME] Starting VM..."
    VBoxManage startvm "$VM_NAME" --type headless

    #Waiting for VM ssh to be ready
    wait_for_ssh
#    echo "[$SCRIPT_NAME] SSH is fully ready"
    echo "[$SCRIPT_NAME] Setting up worker"
    echo "$IP" > "host_ip.txt"

    VM_TARGET_DIR="/home/$USER"

    echo "[$SCRIPT_NAME] Setting up node"
    scp -o ControlPath=~/.ssh/cm-%r@%h:%p -P "$SSH_PORT" "./setup_node.sh" "$VM_USER"@"$SSH_HOST":"/setup_node.sh"
    ssh -o ControlPath=~/.ssh/cm-%r@%h:%p -p "$SSH_PORT" "$VM_USER"@"$SSH_HOST" "chmod +x /setup_node.sh; bash /setup_node.sh $TYPE $USER"

    echo "[$SCRIPT_NAME] Switching user"
    VM_USER=$USER
    VM_TARGET_DIR="/home/$USER"
    wait_for_ssh
    declare -A PACK
    PACK[manager]="host_ip.txt game infra site Makefile"
    PACK[worker]="Makefile"
    read -r -a files <<< "${PACK[$TYPE]}"
    echo "[$SCRIPT_NAME] adding needed file: ${files[@]}"
    ssh -o ControlPath=~/.ssh/cm-%r@%h:%p -p "$SSH_PORT" "$VM_USER"@"$SSH_HOST" "doas mkdir -p $VM_TARGET_DIR"
    scp -o ControlPath=~/.ssh/cm-%r@%h:%p -r -P "$SSH_PORT" "${files[@]}" "$VM_USER"@"$SSH_HOST":"$VM_TARGET_DIR"
fi
ssh -o ControlPath=~/.ssh/cm-%r@%h:%p -p "$SSH_PORT" "$VM_USER"@"$SSH_HOST" "doas make -C $VM_TARGET_DIR node_launch TYPE=$TYPE USER_NAME=$USER"
