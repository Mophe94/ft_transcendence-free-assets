#!/bin/bash

SCRIPT_NAME="${0##*/}"
SCRIPT_LOCATION="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${LOCATION}/${SCRIPT_NAME%.sh}.log"

# Set script variable
CONFIG_FILE=${ENV_FILE}
using_defaults=false

#Base image -->Default value, overide in CONFIG_FILE
DEFAULT_BASE_DIR="$HOME/sgoinfre/students/stempels/"
BASE_IMG_SIZE=10240

SSH_KEY_NAME="transcendence_node"
SSH_KEY_PASSPHRASE=

# VM Configuration
DEFAULT_VM_DIR="$HOME/goinfre/"

# Vm config
RAM_MB=2048
VRAM_MB=16
CPUS=2
DISK_SIZE_LEADER=30720
DISK_SIZE_WORKER=10240

SSH_PORT="2222"
SSH_HOST="localhost"
VM_USER="$USER"
VM_TARGET_DIR="/home/$USER"
CONTROL_PATH="$HOME/.ssh/ssh-mux/%L-%r@%h:%p"

#Safeguard
set -euo pipefail

wait_for_ssh() {
    set +e
    RESULT=1
    TIMEOUT=30
    INTERVAL=2
    ELAPSED=0
    echo -n "[INFO][$SCRIPT_NAME] Waiting for VM to boot."
    while :; do
	status=$(ssh -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=60 ${VM_USER}@${SSH_HOST} -p${SSH_PORT} "exit 0" 2>&1)
	RESULT=$?
	if [ $RESULT -eq 0 ]; then
	    echo " connected"
	    break
	fi
	if [ $RESULT -eq 255 ]; then
	    if [[ $status == *"Permission denied"* ]]; then
		echo " server found"
		break
	    fi
	fi
	TIMEOUT=$((TIMEOUT - 1))
	if [ $TIMEOUT -eq 0 ]; then
	    echo " timed out"
	    exit 1
	fi
	sleep 2
	echo -n "."
    done
    set -e
}

get_env_value() {
    local wanted_key="$1"
    local key
    local value

    if [ ! -f "$ENV_FILE" ]; then
        echo "[ERROR][$SCRIPT_NAME] Missing $ENV_FILE"
        exit 1
    fi
    while IFS='=' read -r key value; do
        [[ -z "${key//[[:space:]]/}" ]] && continue
        [[ "$key" =~ ^[[:space:]]*\# ]] && continue
        key="${key#"${key%%[![:space:]]*}"}"
        key="${key%"${key##*[![:space:]]}"}"
        if [ "$key" = "$wanted_key" ]; then
            printf '%s' "$value"
            return 0
        fi
    done < "$ENV_FILE"
    return 1
}

bootstrap_ssh_key() {
    local root_password
    local pub_key_content
    local askpass

    root_password="$(get_env_value p_root_password)" || {
        echo "[ERROR][$SCRIPT_NAME] Missing p_root_password"
        exit 1
    }
    if [ -z "$root_password" ]; then
        echo "[ERROR][$SCRIPT_NAME] p_root_password is empty"
        exit 1
    fi
    echo "[INFO][$SCRIPT_NAME] Installing SSH key..."
    pub_key_content="$(cat "$PUB_KEY")"

    askpass="$(mktemp)"
    chmod 700 "$askpass"

    cat > "$askpass" <<EOF
#!/bin/sh
printf '%s\n' '$root_password'
EOF
    export SSH_ASKPASS="$askpass"
    export SSH_ASKPASS_REQUIRE=force
    setsid ssh \
        -p "$SSH_PORT" \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o PreferredAuthentications=password \
        -o PubkeyAuthentication=no \
        "$VM_USER@$SSH_HOST" \
        "mkdir -p ~/.ssh &&
         chmod 700 ~/.ssh &&
         touch ~/.ssh/authorized_keys &&
         chmod 600 ~/.ssh/authorized_keys &&
         (grep -qxF '$pub_key_content' ~/.ssh/authorized_keys ||
          echo '$pub_key_content' >> ~/.ssh/authorized_keys)"

    local result=$?
    rm -f "$askpass"
    unset SSH_ASKPASS
    unset SSH_ASKPASS_REQUIRE
    unset root_password
    unset pub_key_content
    if [ "$result" -ne 0 ]; then
        echo "[ERROR][$SCRIPT_NAME] Failed to install SSH key"
        return "$result"
    fi
    echo "[INFO][$SCRIPT_NAME] SSH key installed"
}

run_setup_script() {
    local user_password
    user_password="$(get_env_value p_user_password)" || {
        echo "[$SCRIPT_NAME] Missing p_user_password"
        exit 1
    }
    if [ -z "$user_password" ]; then
        echo "[$SCRIPT_NAME] p_user_password is empty"
        exit 1
    fi

    echo "[$SCRIPT_NAME] Running setup_${TYPE}.sh..."
    printf '%s\n' "$user_password" |
        ssh \
        -p "$SSH_PORT" \
	-tt \
	-o IdentitiesOnly=yes \
	-i "$SSH_KEY" \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        "$VM_USER@$SSH_HOST" \
        "chmod +x /setup_${TYPE}.sh && \
         bash /setup_${TYPE}.sh ${USER} ${HOST_IP} ${resize_disk}"
    unset user_password
}

# Define role of VM
if [ $# -eq 2 ]; then
    if [ "$1" == "leader" ] || [ "$1" == "worker" ]; then
	TYPE="${1,,}"
    else
	echo "[$SCRIPT_NAME] invalid argument $1"
	exit 1
    fi
    HOST_IP="$2"
else
    echo "[$SCRIPT_NAME] invalid argument."
    exit 1
fi

VM_NAME="${TYPE}_node_${USER}"
VAR="DISK_SIZE_${TYPE^^}"
DISK_SIZE_MB=${!VAR}

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
    VBoxManage registervm "$VM_DIR/$VM_NAME/$VM_NAME.vbox"
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
		echo "[$SCRIPT_NAME] $CONFIG_FILE found."
		while IFS='=' read -r key value; do
			case "$key" in
				BASE_DIR) BASE_DIR="$value";;
				VM_DIR) VM_DIR="$value";;
			esac
		done < "$CONFIG_FILE"
		if [ -z "$BASE_DIR" ] || [ -z "$VM_DIR" ]; then
			using_defaults=true
			echo "[$SCRIPT_NAME] variable in configuration file."
		fi
	fi

	# Prompt for default value usage
	if [ "$using_defaults" == true ]; then
		echo "[$SCRIPT_NAME] default value:"
		BASE_DIR=$DEFAULT_BASE_DIR
		VM_DIR=$DEFAULT_VM_DIR
		echo -e "\tdirectory: $DEFAULT_VM_DIR\tBase Vm directory: $BASE_DIR"
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
	elif [ ! -f "$BASE_DIR/$BASE_IMG" ];then
		echo "[$SCRIPT_NAME] base vm image in $BASE_DIR"
		exit 1
	fi

	echo "[$SCRIPT_NAME] name: $VM_NAME"
	echo "[$SCRIPT_NAME] directory: $VM_DIR"

    # Create VM
    echo "[$SCRIPT_NAME] Creating VM..."
    VBoxManage createvm \
	--name "$VM_NAME" \
	--basefolder "$VM_DIR" \
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
	    --natpf1 "headscale,tcp,,9090,,8080" \
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

    resize_disk=false
    if [ "$DISK_SIZE_MB" -gt "$BASE_IMG_SIZE" ]; then
	VBoxManage modifymedium disk \
	    "$VM_DIR/$VM_NAME/$VM_NAME.vdi" \
	    --resize "${DISK_SIZE_MB}"
	resize_disk=true
    fi

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

    # Generating ssh key
    SSH_KEY="$HOME/.ssh/${SSH_KEY_NAME}"
    PUB_KEY="$SSH_KEY.pub"
    if [ ! -f "$PUB_KEY" ]; then
	ssh-keygen -t ed25519 \
	    -f "$SSH_KEY" \
	    -N "$SSH_KEY_PASSPHRASE"
    fi
    wait_for_ssh

    echo "[$SCRIPT_NAME] Setting up node"
    echo "$HOST_IP" > "infra/host_ip.txt"
    bootstrap_ssh_key

    echo "[$SCRIPT_NAME] Adding needed file"
    declare -A BUNDLE
    BUNDLE[leader]="vm_management/setup_leader.sh vm_management/cert_rootCA.sh vm_management/cert_info.env"
    BUNDLE[worker]="vm_management/setup_worker.sh vm_management/setup_for_swarm.sh"
    read -r -a files <<< "${BUNDLE[$TYPE]}"
    VM_TARGET_DIR="/"
    set +e
    scp -r -P "$SSH_PORT" -o IdentitiesOnly=yes -i "$SSH_KEY" -o StrictHostKeyChecking=no "${files[@]}" "$VM_USER"@"$SSH_HOST":"$VM_TARGET_DIR"
    run_setup_script
    set -e

    while ssh -p $SSH_PORT -o IdentitiesOnly=yes -i "$SSH_KEY" -o ConnectTimeout=2 -o BatchMode=yes "$VM_USER"@"$SSH_HOST" true >/dev/null 2>&1; do
	sleep 2
    done
    echo "[$SCRIPT_NAME] Switching user"
    VM_USER=$USER
    VM_TARGET_DIR="/home/$USER"
    echo "[$SCRIPT_NAME] Current user: $VM_USER"
    wait_for_ssh
    declare -A PACK
    PACK[leader]="infra site backend database game_test redis"
    PACK[worker]=""
    read -r -a files <<< "${PACK[$TYPE]}"
    if ((${#files[@]} == 0)); then
	echo "[INFO][$SCRIPT_NAME] No files to copy"
    else
	echo "[INFO][$SCRIPT_NAME] Adding needed files"
	set +e
	scp -r -P "$SSH_PORT" -o IdentitiesOnly=yes -i "$SSH_KEY" -o StrictHostKeyChecking=no "${files[@]}" "$VM_USER"@"$SSH_HOST":"$VM_TARGET_DIR"
	set -e
    fi
fi
