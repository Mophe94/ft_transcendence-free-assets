FROM alpine:latest

RUN ln -sf /bin/true /usr/sbin/grub-probe

RUN apk update && apk upgrade && apk add --no-cache \
	    alpine-conf \
	    alpine-sdk \
	    linux-virt \
	    syslinux \
	    apk-tools \
	    dosfstools \
	    mtools \
            squashfs-tools \
            xorriso \
	    kmod 

#RUN apk add  syslinux-utils

WORKDIR /build
COPY --chmod=777 node_info/entrypoint.sh .
COPY --chmod=777 node_info/answerfile .
COPY --chmod=777 node_info/autoinstall.start .

WORKDIR /root
RUN mkdir -p aports
RUN git clone --depth 1 git://git.alpinelinux.org/aports aports
RUN chmod +x aports/scripts/mkimage.sh
RUN sed -i 's/--no-chown.*//' aports/scripts/mkimage.sh
RUN mkdir -pv /build/tmp && export TMPDIR=/build/tmp

RUN addgroup root abuild

COPY --chmod=777 node_info/mkimg.swarm_node.sh aports/scripts/mkimg.swarm_node.sh
COPY --chmod=777 node_info/genapkovl-swarm_node.sh aports/scripts/genapkovl-swarm_node.sh 

WORKDIR /root/aports/scripts

CMD ["/bin/sh", "-c", "/build/entrypoint.sh"]
