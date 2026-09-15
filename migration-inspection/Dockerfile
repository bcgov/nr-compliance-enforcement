# flyway/flyway:9.10-alpine as of 2026-09-15
FROM flyway/flyway@sha256:4118b764c2ae51e980a94d0e43fde0ed2ad273abe641ce43d03f62da7f7fb6f9

# Create directory for test and baseline scripts before we switch to app user
RUN mkdir -p /flyway/sql-test && mkdir -p /flyway/baseline && adduser -D app

# Non-root user
USER app

# Copy migrations
COPY ./migrations /flyway/sql
COPY ./test-only-migrations /flyway/sql-test
COPY ./baseline /flyway/baseline

# Startup
CMD ["info","migrate","info"]