FROM flyway/flyway:9.22-alpine

# Create directory for test scripts before we switch to app user
RUN mkdir -p /flyway/sql-test

# Copy migrations
COPY ./sql /flyway/sql
COPY ./test-only-migrations /flyway/sql-test

# Non-root user
RUN adduser -D app
USER app

# Health check and startup
HEALTHCHECK CMD info
CMD ["info", "migrate", "info"]
