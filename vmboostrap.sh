#!/bin/sh

set -eux

# Create user password
echo "dev:changeme" | chpasswd

# Install useful packages
apk update
apk add \
    bash \
    curl \
    git \
    htop \
    sudo \
    vim \
    docker

# Add user to wheel
adduser dev wheel

# Enable sudo for wheel group
echo '%wheel ALL=(ALL) ALL' > /etc/sudoers.d/wheel

chmod 440 /etc/sudoers.d/wheel

# Enable services
rc-update add sshd
rc-update add chronyd

# Optional Docker
# apk add docker
# rc-update add docker
# service docker start

echo "Bootstrap complete."
