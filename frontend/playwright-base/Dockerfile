# Base of playwright containing costly browser installs, overlaid with e2e test code
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392

# Must match @playwright/test in frontend/package.json
ENV PLAYWRIGHT_VERSION=1.62.1
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl dnsutils \
 && mkdir /tmp/pw \
 && npm install --prefix /tmp/pw --ignore-scripts --no-save --no-audit --no-fund playwright@${PLAYWRIGHT_VERSION} \
 && node /tmp/pw/node_modules/playwright/cli.js install --with-deps webkit \
 && rm -rf /tmp/pw /var/lib/apt/lists/* /root/.npm \
 && chgrp -R 0 /ms-playwright \
 && chmod -R g+rwX /ms-playwright
