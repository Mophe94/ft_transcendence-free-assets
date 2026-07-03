#!/bin/bash
set -euo pipefail

GAME_DB_NAME=$(cat /run/secrets/db_game_db_name)
GAME_DB_USER=$(cat /run/secrets/db_game_username)
GAME_DB_PASSWORD=$(cat /run/secrets/db_game_password)
POSTGRES_PASSWORD=$(cat /run/secrets/db_game_postgres_password)


# 1. Create database and user
psql -v ON_ERROR_STOP=1 \
    --username=postgres \
    --no-password << EOF
    CREATE DATABASE ${GAME_DB_NAME} ENCODING 'UTF-8' LC_COLLATE 'C.UTF-8' LC_CTYPE 'C.UTF-8' TEMPLATE template0;
    CREATE USER ${GAME_DB_USER} WITH PASSWORD '${GAME_DB_PASSWORD}';
    GRANT CONNECT ON DATABASE ${GAME_DB_NAME} TO ${GAME_DB_USER};
    REVOKE ALL ON DATABASE ${GAME_DB_NAME} FROM PUBLIC;
EOF

# 2. Initialize schema and data (creates tables)
echo "Running schema initialization on ${GAME_DB_NAME}..."
psql -v ON_ERROR_STOP=1 \
     --username=postgres \
     --dbname="${GAME_DB_NAME}" \
     -f /app/sql/game_db_init.sql

# 3. Grant privileges and transfer ownership (tables exist now)
psql -v ON_ERROR_STOP=1 \
    --username=postgres \
    --no-password \
    -d ${GAME_DB_NAME} << EOF
    GRANT ALL ON SCHEMA public TO ${GAME_DB_USER};
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${GAME_DB_USER};
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${GAME_DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${GAME_DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${GAME_DB_USER};

    -- Transfer ownership of all tables to the game DB user
    -- Required to allow TypeORM (synchronize: true) to alter tables at startup
    ALTER TABLE public.monsters OWNER TO ${GAME_DB_USER};
    ALTER TABLE public.skills OWNER TO ${GAME_DB_USER};
    ALTER TABLE public.monsters_skills OWNER TO ${GAME_DB_USER};
    ALTER TABLE public.items OWNER TO ${GAME_DB_USER};
EOF