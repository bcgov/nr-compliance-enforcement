# alpine:3.20 as of 2026-09-15
FROM alpine@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc

RUN apk add --no-cache rclone curl

# OpenShift assigns a random UID; give rclone a writable config dir
ENV RCLONE_CONFIG=/tmp/rclone.conf HOME=/tmp
USER 1001

ENTRYPOINT ["/bin/sh"]
