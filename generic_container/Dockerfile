FROM debian:12-slim

LABEL   org.opencontainers.image.title="transcendance-base" \
        org.opencontainers.image.description="Base image for all Transcendance microservices"

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

ENTRYPOINT ["/usr/bin/dumb-init", "--"]