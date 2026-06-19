#!/bin/sh

mkdir -p /etc/nginx/ssl
if [ ! -f /etc/nginx/ssl/inception.crt ]; then
    echo "Generating SSL for ${DOMAIN_NAME}..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/inception.key \
        -out /etc/nginx/ssl/inception.crt \
        -subj "/C=BE/ST=BXL/L=Bruxelles/O=42/OU=42/CN=${DOMAIN_NAME}"
else
    echo "SSL certificate already existing."
fi

echo "Generating nginx.conf from template..."
envsubst '$DOMAIN_NAME' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/nginx.conf

exec "$@"