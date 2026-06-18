# N8N

The workflow tool that we use for running the Post Upgrade Testing checks and tests is [N8N](https://n8n.io). We have provided a Docker Compose and a Docker File to be able to run N8N locally.

To build the docker file:

```
docker build -t "n8n:Dockerfile" .
```

If you want to run this image with just ephemeral storage:

```
docker run --name n8n-local -p 5678:5678 -d n8n:Dockerfile ["n8n","start"]
```
