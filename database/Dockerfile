# RedHat UBI 8 with nodejs 14
# postgis/postgis:16-3.5-alpine as of 2026-10-16
FROM postgis/postgis@sha256:47e961a569fd52ff31f0fe205ed91eeab17d9f5fff6722e6d7ea6b588748b293

# Enable pgcrypto extension on startup
RUN sed -i \
        -e '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        -e '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' \
        -e '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pg_trgm;' \
        -e '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;' \
        -e '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS unaccent;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Health check - recommended for local dev
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]

# Non-privileged user
USER postgres