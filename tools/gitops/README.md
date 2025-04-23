# Compliance and Enforcement GitOps

This folder contains the necessary manifests to standup the basis for GitOps within the Emerald project set `f208ae`


> These manifests are intended to be applied manually by a team member during first time setup and are documented here for historical purposes

# How to apply

> It is assumed you've already logged into the Emerald cluster with oc

```
oc apply -n f208ae-tools -f gitops-team.yaml
```

Lastly apply the 'administrative' Argo Application that will manage all other applications

> As a first time setup, the contents are copy-pasted into the ArgoCD UI (edit as yaml) as this main manifest cannot be manually applied into any namespace that Argo can read from

[Argo App of Apps Initialization Manifest](tools/gitops/argo-app-of-apps.yaml)
