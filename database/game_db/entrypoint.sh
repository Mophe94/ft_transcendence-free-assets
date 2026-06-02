#!/bin/bash
set -euo pipefail

: "${GAME_DB_USER:?GAME_DB_USER variable not defined}"
: "${GAME_DB_PASSWORD:?GAME_DB_PASSWORD variable not defined}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD variable not defined}"
: "${GAME_DB_NAME:?GAME_DB_NAME variable not defined}"

psql -v ON_ERROR_STOP=1 \
    --username=postgres \
    --no-password << EOF
    CREATE DATABASE ${GAME_DB_NAME} ENCODING 'UTF-8' LC_COLLATE 'C.UTF-8' LC_CTYPE 'C.UTF-8' TEMPLATE template0;
    CREATE USER ${GAME_DB_USER} WITH PASSWORD '${GAME_DB_PASSWORD}';
    GRANT CONNECT ON DATABASE ${GAME_DB_NAME} TO ${GAME_DB_USER};
    REVOKE ALL ON DATABASE ${GAME_DB_NAME} FROM PUBLIC;
EOF

psql -v ON_ERROR_STOP=1 \
    --username=postgres \
    --no-password \
    -d ${GAME_DB_NAME} << EOF
    GRANT USAGE ON SCHEMA public TO ${GAME_DB_USER};
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${GAME_DB_USER};
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${GAME_DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${GAME_DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${GAME_DB_USER};
EOF

echo "Running schema initialization on ${GAME_DB_NAME}..."
psql -v ON_ERROR_STOP=1 \
     --username="$POSTGRES_USER" \
     --dbname="${GAME_DB_NAME}" \
     -f /app/sql/game_db_init.sql