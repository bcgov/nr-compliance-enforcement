FROM flyway/flyway:9.10-alpine

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