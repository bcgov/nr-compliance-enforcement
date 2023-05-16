FROM flyway/flyway:9.10-alpine

# Non-root user
RUN adduser -D app
USER app

HEALTHCHECK none

# Copy migrations
COPY ./migrations /flyway/sql

# Startup
CMD ["info","migrate","info"]