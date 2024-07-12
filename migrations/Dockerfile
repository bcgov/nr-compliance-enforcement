FROM flyway/flyway:10-alpine

# Copy migrations
COPY ./sql /flyway/sql
COPY ./test-only-migrations /flyway/sql-test

# Non-root user
RUN adduser -D app
USER app

# Health check and startup
HEALTHCHECK CMD info
CMD ["info", "migrate", "info"]
