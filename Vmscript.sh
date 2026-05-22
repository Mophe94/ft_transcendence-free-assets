#!/usr/bin/env bash

SCRIPT_NAME="${0##*/}"
SSH_PORT="2222"
SSH_HOST="localhost"
VM_USER="root"

# VM Configuration
VM_DIR="$HOME/VirtualBox VMs"   # Default VM directory
VM_NAME="transcendence_node_test"    # Default VM name

RAM_MB=2048
VRAM_MB=16
CPUS=2
DISK_SIZE_MB=10240

# Help function

Help()
{
    # Display help
    echo 
    echo "Syntax: $SCRIPT_NAME <iso_path> [OPTION][- h|n|d]"
    echo "Options:"
    echo "  h       Display help"
    echo "  n       Name of the VM"
    echo "  d       Directory in wich the VM will be stored"
    echo 
}

#Safeguard
set -euo pipefail
if [ $# -lt 1 ]; then
    Help
    exit 1
else
    ISO_FILE=$1
fi
if [ ! -f "$ISO_FILE" ]; then
    echo "ERROR: file \"$1\" does not exist"
    Help
    exit 1
else
    FILE_NAME="${ISO_FILE##*/}"
    case "$FILE_NAME" in
        *.iso|*.ISO)
            ;;
        *)
            echo "ERROR: "$FILE_NAME" is not an .iso"
            Help
            exit 1;;
    esac
fi

# Options handling
while getopts ":hn:d:" option; do
    case $option in
        h) # display Help
            Help
            exit;;
        n) # set the name of the VM.
            VM_NAME="$OPTARG";;
        d) # set the directory of the VM
            if [ -d "$OPTARG" ]; then
                VM_DIR=$OPTARG
            else
                echo "Directory $OPTARG does not exist"
                exit 1
            fi;;
        \?) # Invalid option
            echo "Error: Invalid option"
            echo
            Help
            exit;;
    esac
done


echo "VM name: $VM_NAME"
echo "VM directory: $VM_DIR"
# Create VM
echo "Creating VM..."
VBoxManage createvm \
    --name "$VM_NAME" \
    --ostype "Linux_64" \
    --register

# Configure VM
echo "Configuring VM..."
VBoxManage modifyvm "$VM_NAME" \
    --memory "$RAM_MB" \
    --vram "$VRAM_MB" \
    --cpus "$CPUS" \
    --nic1 nat \
    --audio-enabled off \
    --usb off \
    --clipboard bidirectional \
    --draganddrop bidirectional

# Create Disk
echo "Creating virtual disk..."
VBoxManage createmedium disk \
    --filename "$VM_DIR/$VM_NAME/$VM_NAME.vdi" \
    --size "$DISK_SIZE_MB" \
    --format VDI

# Storage Controllers
echo "Adding storage controllers..."
VBoxManage storagectl "$VM_NAME" \
    --name "SATA Controller" \
    --add sata \
    --controller IntelAhci

VBoxManage storagectl "$VM_NAME" \
    --name "IDE Controller" \
    --add ide

# Attach Disk
echo "Attaching disk..."

VBoxManage storageattach "$VM_NAME" \
    --storagectl "SATA Controller" \
    --port 0 \
    --device 0 \
    --type hdd \
    --medium "$VM_DIR/$VM_NAME/$VM_NAME.vdi"

# Attach ISO
echo "Attaching Alpine ISO..."

VBoxManage storageattach "$VM_NAME" \
    --storagectl "IDE Controller" \
    --port 0 \
    --device 0 \
    --type dvddrive \
    --medium "$ISO_FILE"

# Boot Order
VBoxManage modifyvm "$VM_NAME" \
    --boot1 dvd \
    --boot2 disk \
    --boot3 none \
    --boot4 none

# Start VM
VBoxManage startvm "$VM_NAME" \
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
