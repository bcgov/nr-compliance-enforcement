FROM flyway/flyway:9.10-alpine

# Non-root user
RUN adduser -D app
USER app

# Copy migrations
COPY ./migrations /flyway/sql

RUN mkdir -p /flyway/sql-test

COPY ./test-only-migrations /flyway/sql-test

# Startup
CMD ["info","migrate","info"]