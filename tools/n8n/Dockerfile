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

# ---- OpenShift-friendly writable dirs ----
RUN mkdir -p /data $HOME/.n8n && \
      mkdir -p /opt/app-root/src/.n8n-files && \
      chgrp -R 0 /data $HOME && \
      chmod -R g+rwX /data $HOME

# Bundle the triage tree under /opt/triage (an image layer — NOT /data or /backup, which are PVC
# mounts at runtime that would shadow it). The n8n-entrypoint.sh wrapper (wired into ENTRYPOINT
# below) adds /opt/triage and EVERY baked group's snippets dir to PATH at startup, so node commands
# call snippets / validators / merge.sh / report.sh by bare name — for any group the team adds, with
# no per-group edit here. Each script self-locates via $0, so utils.sh / render.sh / the doc-link
# shim still resolve.
COPY render.sh utils.sh view.sh merge.sh report.sh n8n-entrypoint.sh /opt/triage/
COPY snippets /opt/triage/snippets/
RUN chmod +x /opt/triage/*.sh /opt/triage/snippets/*/*.sh
ENV PATH="/opt/triage:${PATH}"

WORKDIR /data
EXPOSE 5678/tcp
ENTRYPOINT ["tini", "--", "/opt/triage/n8n-entrypoint.sh"]

CMD ["n8n"]
