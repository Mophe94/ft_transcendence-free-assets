FROM debian:12-slim

LABEL   version="0.1" \
		org.opencontainers.image.source="https://github.com/sitempels/ft_transcendence" \
		org.opencontainers.image.title="dev-transcendance-base" \
        org.opencontainers.image.description="Base image for all Transcendance microservices"

ONBUILD	apt-get update && apt-get upgrade -y

ENV TZ=Europe/Brussels \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
      tzdata \        
      ca-certificates \ 
      curl \          
      bash \          
      dumb-init \     
    && apt-get clean \                    
    && rm -rf /var/lib/apt/lists/*   

ENTRYPOINT ["/bin/bash", "-c", "echo coucou from docker"]
