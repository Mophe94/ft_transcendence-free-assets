#!/usr/bin/env bash

SCRIPT_NAME="${0##*/}"
SSH_PORT="2222"
SSH_HOST="localhost"
VM_USER="root"

#Base src
BASE_DIR="$HOME/sgoinfre/students/stempels"
BASE_IMG="vm_base_image.vdi"

# VM Configuration
VM_DIR="$HOME/goinfre"   # Default VM directory
VM_NAME="swarmnode_$USER"    # Default VM name

RAM_MB=2048
VRAM_MB=16
CPUS=2
DISK_SIZE_MB=10240

echo "VM name: $VM_NAME"
echo "VM directory: $VM_DIR"
# Create VM
echo "Creating VM..."
VBoxManage createvm \
    --name "$VM_NAME" \
    --register

#Clone disk from base
echo "Creating virtual disk..."
mkdir -p "$VM_DIR/$VM_NAME"
VBoxManage clonemedium disk $BASE_DIR/$BASE_IMG $VM_DIR/$VM_NAME/$VM_NAME.vdi

# Storage Controllers
echo "Adding storage controllers..."
VBoxManage storagectl "$VM_NAME" \
    --name "SATA Controller" \
    --add sata \

# Attach Disk
echo "Attaching disk..."

VBoxManage storageattach "$VM_NAME" \
    --storagectl "SATA Controller" \
    --port 0 \
    --device 0 \
    --type hdd \
    --medium "$VM_DIR/$VM_NAME/$VM_NAME.vdi"

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

# Boot Order
#VBoxManage modifyvm "$VM_NAME" \
#   --boot1 dvd \
#    --boot2 disk \
#    --boot3 none \
#    --boot4 none

#Set scalable GUI
VBoxManage setextradata "$VM_NAME" \
	--GUI/SCALEMODE "true"

# Start VM
VBoxManage startvm "$VM_NAME"
#    --type headless
echo "Starting VM..."

# Wait until SSH becomes reachable
echo "Waiting for SSH..."

while ! ssh \
    -p 2222 \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o ConnectTimeout=2 \
    "$VM_USER@$SSH_HOST" true 2>/dev/null
do
    sleep 2
done

echo "SSH is online"
#echo ""
#echo "VM '$VM_NAME' is now running."
#echo ""
#echo " mkdir /mnt/setup"
#echo " mount -t vboxsf setup /mnt/setup"
#echo " setup-alpine -f /mnt/setup/answer.conf"
#echo ""
#echo "When installation is complete:"
#echo "  poweroff"
#echo ""
#echo "Then detach ISO:"
#echo "  VBoxManage storageattach \"$VM_NAME\" \\"
#echo "      --storagectl \"IDE Controller\" \\"
#echo "      --port 0 --device 0 \\"
#echo "      --medium none"

#scp -r /path/to/local/directory user@VM_IP:/path/on/vm
