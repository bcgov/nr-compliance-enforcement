# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:15-master@sha256:11d424c70a9bfbec79fcfcd6fdacfefa9895c790c45146915f06bbb5403004fa

# Enable pgcrypto extension on startup
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

RUN apt-get update && apt-get install -y curl

RUN apt-get -y install postgresql-15-cron

# Health check - recommended for local dev
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]

# Non-privileged user
USER postgres