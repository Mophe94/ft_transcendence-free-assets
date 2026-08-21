#!/bin/bash

SCRIPT_NAME="${0##*/}"
SCRIPT_LOCATION="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS_LOCATION="${LOGS_LOCATION:-"."}/${SCRIPT_NAME%.sh}"
LOG_FILE="${LOGS_LOCATION}/${SCRIPT_NAME%.sh}_$(date '+%Y-%m-%d_%H-%M-%S').log"


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[32m'
COLOR_ORANGE='\033[38;5;208m'
COLOR_RED='\033[31m'

mkdir -p "$LOGS_LOCATION"
mkdir -p "$(dirname "$LOG_FILE")"

# File descriptor 3: log file
exec 3>>"$LOG_FILE"

# File descriptor 4: terminal
exec 4>&1

# Log everything else to the log and terminal
exec > >(tee -a "$LOG_FILE") 2>&1

log_info() {
    local message="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    printf '%b[INFO]%b[%s] %s\n' \
        "$COLOR_GREEN" \
        "$COLOR_RESET" \
        "$SCRIPT_NAME" \
        "$message" >&4

    printf '[INFO][%s][%s] %s\n' \
        "$timestamp" \
        "$SCRIPT_NAME" \
        "$message" >&3
}

log_warn() {
    local message="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    printf '%b[WARN]%b[%s] %s\n' \
        "$COLOR_ORANGE" \
        "$COLOR_RESET" \
        "$SCRIPT_NAME" \
        "$message" >&4

    printf '[WARN][%s][%s] %s\n' \
        "$timestamp" \
        "$SCRIPT_NAME" \
        "$message" >&3
}

log_error() {
    local message="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    printf '%b[ERROR]%b[%s] %s\n' \
        "$COLOR_RED" \
        "$COLOR_RESET" \
        "$SCRIPT_NAME" \
        "$message" >&4

    printf '[ERROR][%s][%s] %s\n' \
        "$timestamp" \
        "$SCRIPT_NAME" \
        "$message" >&3
}

# ---------------------------------------------------------------------------
# SSH
# ---------------------------------------------------------------------------

wait_for_ssh() {
    set +e

    local timeout=30
    local interval=2
    local status
    local result

    log_info "Waiting for VM to boot"

    while :; do
        status=$(
            ssh \
                -o StrictHostKeyChecking=no \
                -o BatchMode=yes \
                -o ConnectTimeout=2 \
                "${VM_USER}@${SSH_HOST}" \
                -p"${SSH_PORT}" \
                "exit 0" \
                2>&1
        )

        result=$?

        if [ "$result" -eq 0 ]; then
            printf '\n'
            log_info "VM SSH connection established"
            break
        fi

        if [ "$result" -eq 255 ] &&
           [[ "$status" == *"Permission denied"* ]]; then
            printf '\n'
            log_info "VM SSH server is available"
            break
        fi

        printf '.' >&4
        sleep "$interval"

        timeout=$((timeout - 1))

        if [ "$timeout" -eq 0 ]; then
            printf '\n'
            log_error "Timed out waiting for VM SSH"
            set -e
            exit 1
        fi
    done

    set -e
}

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

get_env_value() {
    local wanted_key="$1"
    local key
    local value

    if [ ! -f "$ENV_FILE" ]; then
        log_error "Missing $ENV_FILE"
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

# ---------------------------------------------------------------------------
# SSH Key Bootstrap
# ---------------------------------------------------------------------------

bootstrap_ssh_key() {
    local root_password
    local pub_key_content
    local askpass

    root_password="$(get_env_value p_root_password)" || {
        log_error "Missing p_root_password"
        exit 1
    }

    if [ -z "$root_password" ]; then
        log_error "p_root_password is empty"
        exit 1
    fi

    log_info "Installing SSH key"

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
        log_error "Failed to install SSH key"
        return "$result"
    fi

    log_info "SSH key installed"
}

# ---------------------------------------------------------------------------
# Node Setup
# ---------------------------------------------------------------------------

run_setup_script() {
    local user_password

    user_password="$(get_env_value p_user_password)" || {
        log_error "Missing p_user_password"
        exit 1
    }

    if [ -z "$user_password" ]; then
        log_error "p_user_password is empty"
        exit 1
    fi

    log_info "Running setup_${TYPE}.sh"

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

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

set -euo pipefail

if [ $# -eq 2 ]; then
    if [ "$1" == "leader" ] || [ "$1" == "worker" ]; then
        TYPE="${1,,}"
    else
        log_error "Invalid argument: $1"
        exit 1
    fi

    HOST_IP="$2"
else
    log_error "Invalid argument"
    exit 1
fi

# ---------------------------------------------------------------------------
# Script Configuration
# ---------------------------------------------------------------------------

# SSH
SSH_KEY_NAME="transcendence_node"
SSH_KEY_PASSPHRASE=
SSH_PORT="2222"
SSH_HOST="localhost"

# VM Configuration
VM_NAME="${TYPE}_node_${USER}"
VM_USER="$USER"
VM_TARGET_DIR="/home/$USER"
CONFIG_FILE="${ENV_FILE:-}"

# Default VM directories
using_defaults=false
DEFAULT_BASE_DIR="$HOME/sgoinfre/students/stempels/"
DEFAULT_VM_DIR="$HOME/goinfre/"

# Base VM image
BASE_IMG_SIZE=10240

# VM Hardware
RAM_MB=2048
VRAM_MB=16
CPUS=2
DISK_SIZE_LEADER=30720
DISK_SIZE_WORKER=10240
VAR="DISK_SIZE_${TYPE^^}"
DISK_SIZE_MB=${!VAR}

# ---------------------------------------------------------------------------
# Check VM State
# ---------------------------------------------------------------------------

if VBoxManage showvminfo "$VM_NAME" --machinereadable 2>&1 |
    grep -q '^VMState="running"'; then

    log_info "$VM_NAME is already running"
    wait_for_ssh

elif VBoxManage showvminfo "$VM_NAME" >/dev/null 2>&1; then

    log_info "$VM_NAME exists"

    # Start VM
    log_info "Starting VM"
    VBoxManage startvm "$VM_NAME" --type headless
    wait_for_ssh

elif [ -f "$VM_DIR/$VM_NAME/$VM_NAME.vbox" ]; then

    log_warn "$VM_NAME exists but is not registered. Registering now"

    VBoxManage registervm "$VM_DIR/$VM_NAME/$VM_NAME.vbox"

    # Start VM
    log_info "Starting VM"
    VBoxManage startvm "$VM_NAME" --type headless
    wait_for_ssh

else
    VM_USER="root"

    # -----------------------------------------------------------------------
    # Load Configuration
    # -----------------------------------------------------------------------

    if [ ! -f "$CONFIG_FILE" ]; then
        using_defaults=true
        log_warn "$CONFIG_FILE not found"

    else
        log_info "$CONFIG_FILE found"

        while IFS='=' read -r key value; do
            case "$key" in
                BASE_DIR)
                    BASE_DIR="$value"
                    ;;
                VM_DIR)
                    VM_DIR="$value"
                    ;;
            esac
        done < "$CONFIG_FILE"

        if [ -z "${BASE_DIR:-}" ] || [ -z "${VM_DIR:-}" ]; then
            using_defaults=true
            log_warn "Variable missing in configuration file"
        fi
    fi

    # -----------------------------------------------------------------------
    # Apply Default Configuration
    # -----------------------------------------------------------------------

    if [ "$using_defaults" == true ]; then
        log_warn "Using default values"

        BASE_DIR="$DEFAULT_BASE_DIR"
        VM_DIR="$DEFAULT_VM_DIR"

        log_info "VM directory: $DEFAULT_VM_DIR"
        log_info "Base VM directory: $BASE_DIR"

        read -p " Proceed with these values ? (y/N): " answer

        case "${answer,,}" in
            [y]|[yes])
                log_info "Proceeding with default values"
                ;;
            *)
                log_warn "Aborted"
                exit 1
                ;;
        esac
    fi

    # -----------------------------------------------------------------------
    # Validate Configuration
    # -----------------------------------------------------------------------

    if [ ! -d "$BASE_DIR" ] || [ ! -d "$VM_DIR" ]; then
        log_error "Directory $BASE_DIR or $VM_DIR does not exist"
        exit 1

    elif [ ! -f "$BASE_DIR/$BASE_IMG" ]; then
        log_error "Base VM image does not exist: $BASE_DIR/$BASE_IMG"
        exit 1
    fi

    log_info "VM name: $VM_NAME"
    log_info "VM directory: $VM_DIR"

    # -----------------------------------------------------------------------
    # Create VM
    # -----------------------------------------------------------------------

    log_info "Creating VM"

    VBoxManage createvm \
        --name "$VM_NAME" \
        --basefolder "$VM_DIR" \
        --register

    # -----------------------------------------------------------------------
    # Configure VM
    # -----------------------------------------------------------------------

    log_info "Configuring VM"

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

    # -----------------------------------------------------------------------
    # Create Virtual Disk
    # -----------------------------------------------------------------------

    log_info "Creating virtual disk"

    mkdir -p "$VM_DIR/$VM_NAME"

    VBoxManage clonemedium disk \
        "$BASE_DIR/$BASE_IMG" \
        "$VM_DIR/$VM_NAME/$VM_NAME.vdi"

    resize_disk=false

    if [ "$DISK_SIZE_MB" -gt "$BASE_IMG_SIZE" ]; then
        log_info "Resizing disk to ${DISK_SIZE_MB} MB"

        VBoxManage modifymedium disk \
            "$VM_DIR/$VM_NAME/$VM_NAME.vdi" \
            --resize "${DISK_SIZE_MB}"

        resize_disk=true
    fi

    # -----------------------------------------------------------------------
    # Configure Storage
    # -----------------------------------------------------------------------

    log_info "Adding storage controllers"

    VBoxManage storagectl "$VM_NAME" \
        --name "SATA Controller" \
        --add sata

    log_info "Attaching disk"

    VBoxManage storageattach "$VM_NAME" \
        --storagectl "SATA Controller" \
        --port 0 \
        --device 0 \
        --type hdd \
        --medium "$VM_DIR/$VM_NAME/$VM_NAME.vdi"

    # -----------------------------------------------------------------------
    # Configure Boot Order
    # -----------------------------------------------------------------------

    log_info "Configuring boot order"

    VBoxManage modifyvm "$VM_NAME" \
        --boot1 disk \
        --boot2 none \
        --boot3 none \
        --boot4 none

    # -----------------------------------------------------------------------
    # Configure GUI Scaling
    # -----------------------------------------------------------------------

    log_info "Configuring GUI scaling"

    VBoxManage setextradata "$VM_NAME" \
        --GUI/SCALEMODE "true"

    # -----------------------------------------------------------------------
    # Start VM
    # -----------------------------------------------------------------------

    log_info "Starting VM"

    VBoxManage startvm "$VM_NAME" --type headless

    # -----------------------------------------------------------------------
    # Configure SSH Key
    # -----------------------------------------------------------------------

    log_info "Checking SSH key"

    SSH_KEY="$HOME/.ssh/${SSH_KEY_NAME}"
    PUB_KEY="$SSH_KEY.pub"

    if [ ! -f "$PUB_KEY" ]; then
        log_info "Generating SSH key"

        ssh-keygen -t ed25519 \
            -f "$SSH_KEY" \
            -N "$SSH_KEY_PASSPHRASE"
    else
        log_info "SSH key already exists: $SSH_KEY"
    fi

    # -----------------------------------------------------------------------
    # Wait for SSH
    # -----------------------------------------------------------------------

    wait_for_ssh

    # -----------------------------------------------------------------------
    # Set Up Node
    # -----------------------------------------------------------------------

    log_info "Setting up node"

    echo "$HOST_IP" > "infra/host_ip.txt"

    bootstrap_ssh_key

    # -----------------------------------------------------------------------
    # Copy Setup Files
    # -----------------------------------------------------------------------

    log_info "Adding needed files"

    declare -A BUNDLE

    BUNDLE[leader]="vm_management/setup_leader.sh vm_management/cert_rootCA.sh vm_management/cert_info.env"
    BUNDLE[worker]="vm_management/setup_worker.sh vm_management/setup_for_swarm.sh"

    read -r -a files <<< "${BUNDLE[$TYPE]}"

    VM_TARGET_DIR="/"

    set +e

    scp \
        -r \
        -P "$SSH_PORT" \
        -o IdentitiesOnly=yes \
        -i "$SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "${files[@]}" \
        "$VM_USER@$SSH_HOST:$VM_TARGET_DIR"

    SCP_RESULT=$?

    if [ "$SCP_RESULT" -ne 0 ]; then
        log_error "Failed to copy setup files"
        set -e
        exit "$SCP_RESULT"
    fi

    # -----------------------------------------------------------------------
    # Run Node Setup
    # -----------------------------------------------------------------------

    run_setup_script

    set -e

    # -----------------------------------------------------------------------
    # Wait for SSH Restart
    # -----------------------------------------------------------------------

    log_info "Waiting for VM SSH connection to restart"

    while ssh \
        -p "$SSH_PORT" \
        -o IdentitiesOnly=yes \
        -i "$SSH_KEY" \
        -o ConnectTimeout=2 \
        -o BatchMode=yes \
        "$VM_USER@$SSH_HOST" true >/dev/null 2>&1; do

        sleep 2
    done

    # -----------------------------------------------------------------------
    # Switch to User
    # -----------------------------------------------------------------------

    log_info "Switching user"

    VM_USER="$USER"
    VM_TARGET_DIR="/home/$USER"

    log_info "Current user: $VM_USER"

    wait_for_ssh

    # -----------------------------------------------------------------------
    # Copy Project Files
    # -----------------------------------------------------------------------

    declare -A PACK

    PACK[leader]="infra site backend database game/Export redis"
    PACK[worker]=""

    read -r -a files <<< "${PACK[$TYPE]}"

    if ((${#files[@]} == 0)); then
        log_info "No files to copy"
    else
        log_info "Adding needed files"

        set +e

        scp \
            -r \
            -P "$SSH_PORT" \
            -o IdentitiesOnly=yes \
            -i "$SSH_KEY" \
            -o StrictHostKeyChecking=no \
            "${files[@]}" \
            "$VM_USER@$SSH_HOST:$VM_TARGET_DIR"

        SCP_RESULT=$?

        if [ "$SCP_RESULT" -ne 0 ]; then
            log_error "Failed to copy project files"
            set -e
            exit "$SCP_RESULT"
        fi

        set -e
    fi
fi

log_info "Script completed successfully"
