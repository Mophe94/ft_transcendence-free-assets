#!/bin/bash
set -euo pipefail

USERS_DB_NAME=$(cat /run/secrets/db_users_db_name)
USERS_DB_USER=$(cat /run/secrets/db_users_username)
USERS_DB_PASSWORD=$(cat /run/secrets/db_users_password)
POSTGRES_PASSWORD=$(cat /run/secrets/db_users_postgres_password)

psql -v ON_ERROR_STOP=1 \
    --username="postgres" \
    --no-password << EOF
    CREATE DATABASE ${USERS_DB_NAME} ENCODING 'UTF-8' LC_COLLATE 'C.UTF-8' LC_CTYPE 'C.UTF-8' TEMPLATE template0;
    CREATE USER ${USERS_DB_USER} WITH PASSWORD '${USERS_DB_PASSWORD}';
    GRANT CONNECT ON DATABASE ${USERS_DB_NAME} TO ${USERS_DB_USER};
    REVOKE ALL ON DATABASE ${USERS_DB_NAME} FROM PUBLIC;
EOF

echo "Running schema initialization on ${USERS_DB_NAME}..."
psql -v ON_ERROR_STOP=1 \
     --username="postgres" \
     --dbname="${USERS_DB_NAME}" \
     -f /app/sql/users_db_init.sql

psql -v ON_ERROR_STOP=1 \
    --username="postgres" \
    --no-password \
    -d ${USERS_DB_NAME} << EOF
    GRANT USAGE ON SCHEMA public TO ${USERS_DB_USER};
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${USERS_DB_USER};
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${USERS_DB_USER};
    ALTER TABLE "user" OWNER TO ${USERS_DB_USER};
    ALTER TABLE user_stats OWNER TO ${USERS_DB_USER};
    ALTER TYPE user_role OWNER TO ${USERS_DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${USERS_DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${USERS_DB_USER};
EOF

