# Node 22 LTS on UBI9 so globalThis.File is present
FROM registry.access.redhat.com/ubi9/nodejs-22:9.8-1781010268
# dockerfile source https://github.com/bcgov/put/blob/main/containers/workflow/Dockerfile

ENV HOME=/opt/app-root/src \
      TZ=America/Vancouver \
      NPM_CONFIG_PREFIX=$HOME/.npm-global \
      PATH=$HOME/.npm-global/bin:$PATH \
      N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
      TINI_VERSION=v0.19.0

USER 0

# Tini version can be pinned as needed, used for process cleanup
# Install tini (static binary)
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /usr/bin/tini
RUN chmod +x /usr/bin/tini

RUN dnf -y install \
      gcc-c++ \
      make \
      jq \
      postgresql \
      python3 \
      && dnf clean all

RUN curl -fsSL https://downloads-openshift-console.apps.gold.devops.gov.bc.ca/amd64/linux/oc.tar -o /tmp/oc.tar && \
      tar -xf /tmp/oc.tar -C /tmp && \
      mv /tmp/oc /usr/bin/oc && \
      rm -f /tmp/oc.tar

RUN npm install -g npm && npm install -g n8n
# Bundle the markdown render helper (jq-only) so n8n Execute-Command nodes can pipe a
# snippet's JSON through it: ... | render.sh template.md
COPY render.sh /usr/local/bin/render.sh
RUN chmod +x /usr/local/bin/render.sh

# ---- OpenShift-friendly writable dirs ----
RUN mkdir -p /data $HOME/.n8n && \
      mkdir -p /opt/app-root/src/.n8n-files && \
      chgrp -R 0 /data $HOME && \
      chmod -R g+rwX /data $HOME

# Bundle the triage tree so the n8n Execute-Command nodes — which call `bash tools/n8n/...`
# relative to the workdir (/data) — find the snippets, validators, each group's doc-link shim,
# and the render/utils/view helpers baked into the image.
COPY render.sh utils.sh view.sh /data/tools/n8n/
COPY snippets /data/tools/n8n/snippets/

WORKDIR /data
EXPOSE 5678/tcp
ENTRYPOINT ["tini", "--"]

CMD ["n8n"]
