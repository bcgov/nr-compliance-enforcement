FROM flyway/flyway:9.10-alpine

# Create directory for test scripts before we switch to app user
RUN mkdir -p /flyway/sql-test

# Non-root user
RUN adduser -D app
USER app

# Copy migrations
COPY ./migrations /flyway/sql

COPY ./test-only-migrations /flyway/sql-test

# Startup
CMD ["info","migrate","info"]