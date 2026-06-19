Setup Alpine VM

Connect as root
run setup-alpine
reboot
vi /etc/apk/repositories
--> enable community repo
apk update
apk add tmux htop bash build-base
apk add docker docker-compose
{   ntpd -d -q -n -p pool.ntp.org to resync clock
    hwclock --systohc
}--> beware of clocksync

