# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:15-master@sha256:c1288c91f8671521bb7c7d3f08a3e2b537d48cdd1725c78bdf8fa34ac81225f4

# Enable pgcrypto extension on startup
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Health check - recommended for local dev
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]

# Non-privileged user
USER postgres