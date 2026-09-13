FROM alpine:3.20

RUN apk add --no-cache rclone curl

# OpenShift assigns a random UID; give rclone a writable config dir
ENV RCLONE_CONFIG=/tmp/rclone.conf HOME=/tmp
USER 1001

ENTRYPOINT ["/bin/sh"]
