# RedHat UBI 8 with nodejs 14 
FROM postgis/postgis:15-master@sha256:9e03ed5407b7c0e81e0e2191bdb1168334339fd02cbe6fc67ef0a6eb88c0b2c4

# Enable pgcrypto extension on startup 
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \ 
        /docker-entrypoint-initdb.d/10_postgis.sh 

# Health check - recommended for local dev 
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ] 

# Non-privileged user USER postgres
USER postgres