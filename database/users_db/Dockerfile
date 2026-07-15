FROM base-image

COPY entrypoint.sh /docker-entrypoint-initdb.d/
COPY users_db_init.sql /app/sql/

RUN chmod +x /docker-entrypoint-initdb.d/entrypoint.sh
