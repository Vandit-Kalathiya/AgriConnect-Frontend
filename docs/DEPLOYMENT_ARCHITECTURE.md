# CI/CD Pipeline Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Developer Workflow                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ git push
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Repository                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ .deployment-config.yml                                    │ │
│  │ ENABLE_DEPLOYMENT: true/false                             │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Trigger
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              GitHub Actions Workflow                            │
│  (.github/workflows/ci-cd-pipeline.yml)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Job 1: Read Config           │
              │  Parse .deployment-config.yml │
              │  Output: should_deploy=?      │
              └───────────────┬───────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Job 2: Lint                  │
              │  Run ESLint                   │
              │  ✅ Always runs               │
              └───────────────┬───────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Job 3: Build & Push          │
              │  Build Docker Image           │
              │  Push to Docker Hub           │
              │  ✅ Always runs               │
              └───────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │ Job 4: Deploy to EC2  │   │ Job 5: Skip Notice    │
    │ Pull from Docker Hub  │   │ Show skip message     │
    │ Restart container     │   │ ⏭️ Runs if disabled   │
    │ ✅ Runs if enabled    │   └───────────────────────┘
    └───────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │   EC2 Instance        │
    │   Running Container   │
    │   Port 5000           │
    └───────────────────────┘
```

## Decision Flow

```
                    Workflow Triggered
                            │
                            ▼
            ┌───────────────────────────────┐
            │ Read .deployment-config.yml   │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ ENABLE_DEPLOYMENT value?      │
            └───────────────┬───────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
    ┌──────────────┐              ┌──────────────┐
    │   true       │              │   false      │
    └──────┬───────┘              └──────┬───────┘
           │                             │
           ▼                             ▼
    ┌──────────────┐              ┌──────────────┐
    │ Check manual │              │ Check manual │
    │ override?    │              │ override?    │
    └──────┬───────┘              └──────┬───────┘
           │                             │
           ▼                             ▼
    ┌──────────────┐              ┌──────────────┐
    │ force_deploy │              │ force_deploy │
    │ = true?      │              │ = true?      │
    └──────┬───────┘              └──────┬───────┘
           │                             │
    ┌──────┴──────┐              ┌──────┴──────┐
    ▼             ▼              ▼             ▼
  Yes            No            Yes            No
    │             │              │             │
    └──────┬──────┘              └──────┬──────┘
           │                            │
           ▼                            ▼
    ┌──────────────┐            ┌──────────────┐
    │ should_deploy│            │ should_deploy│
    │ = true       │            │ = false      │
    └──────┬───────┘            └──────┬───────┘
           │                            │
           ▼                            ▼
    ┌──────────────┐            ┌──────────────┐
    │ Run CI + CD  │            │ Run CI only  │
    │ (Full)       │            │ (Skip CD)    │
    └──────────────┘            └──────────────┘
```

## Job Dependencies

```
read-config (Job 1)
    │
    ├─────────────┬─────────────┐
    ▼             ▼             ▼
  lint      build-and-push   (outputs)
  (Job 2)      (Job 3)
    │             │
    └──────┬──────┘
           │
           ├─────────────────────────┐
           │                         │
           ▼                         ▼
    deploy-to-ec2           deployment-skipped
    (Job 4)                 (Job 5)
    │                       │
    if: should_deploy       if: !should_deploy
    = true                  = true
```

## Configuration File Structure

```yaml
# .deployment-config.yml
# ═══════════════════════════════════════════════════════════

# Comments explaining the feature
# Usage instructions
# Examples

ENABLE_DEPLOYMENT: true  # or false

# ═══════════════════════════════════════════════════════════
```

## Workflow Outputs

### Job 1: read-config
```yaml
outputs:
  enable_deployment: "true" | "false"  # From config file
  should_deploy: "true" | "false"      # Final decision
```

### Job 2: lint
```yaml
result: "success" | "failure" | "skipped"
```

### Job 3: build-and-push
```yaml
image_tags: 
  - "username/agriconnect-frontend:latest"
  - "username/agriconnect-frontend:main-abc1234"
```

### Job 4: deploy-to-ec2
```yaml
status: "success" | "failure"
deployment_url: "https://agriconnectme.shop"
```

## Environment Variables

### Workflow Level
```yaml
env:
  APP_DIR: /home/ubuntu/AgriConnect_Frontend
  DOCKER_IMAGE: username/agriconnect-frontend
```

### Job Level (from Secrets)
```yaml
secrets:
  EC2_HOST: "13.126.199.8"
  EC2_USERNAME: "ubuntu"
  EC2_SSH_PRIVATE_KEY: "-----BEGIN RSA PRIVATE KEY-----..."
  DOCKER_USERNAME: "dockerhub_user"
  DOCKER_PASSWORD: "dockerhub_token"
```

## Docker Image Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Runner                    │
│                                                             │
│  1. Checkout code                                           │
│  2. Build Docker image                                      │
│     docker build -t user/agriconnect-frontend:latest .      │
│  3. Push to Docker Hub                                      │
│     docker push user/agriconnect-frontend:latest            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Push
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Docker Hub                             │
│  Repository: user/agriconnect-frontend                      │
│  Tags: latest, main-abc1234                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Pull (if deployment enabled)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    EC2 Instance                             │
│                                                             │
│  1. docker pull user/agriconnect-frontend:latest            │
│  2. docker compose up -d                                    │
│  3. Container running on port 5000                          │
└─────────────────────────────────────────────────────────────┘
```

## Comparison: Old vs New

### Old Workflow (deploy.yml)

```
┌─────────────────────────────────────────────────────────────┐
│  Push → Lint → Sync to EC2 → Build on EC2 → Deploy         │
│                                                             │
│  Problems:                                                  │
│  ❌ Always deploys (no control)                            │
│  ❌ Builds on EC2 (slower, uses EC2 resources)             │
│  ❌ No Docker Hub push (image not backed up)               │
│  ❌ Can't test without deploying                           │
└─────────────────────────────────────────────────────────────┘
```

### New Workflow (ci-cd-pipeline.yml)

```
┌─────────────────────────────────────────────────────────────┐
│  Push → Read Config → Lint → Build on GitHub → Push to Hub │
│         ↓                                                   │
│         ├─ if enabled → Pull on EC2 → Deploy               │
│         └─ if disabled → Skip deployment                    │
│                                                             │
│  Benefits:                                                  │
│  ✅ Conditional deployment (config file)                   │
│  ✅ Builds on GitHub (faster, free)                        │
│  ✅ Always pushes to Docker Hub (backup)                   │
│  ✅ Can test builds without deploying                      │
│  ✅ Manual override option                                 │
└─────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Secrets                           │
│  (Encrypted, never exposed in logs)                         │
│                                                             │
│  ├─ EC2_SSH_PRIVATE_KEY                                     │
│  ├─ DOCKER_PASSWORD                                         │
│  └─ Other sensitive data                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Injected at runtime
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Jobs                            │
│  (Secrets available as ${{ secrets.NAME }})                 │
│                                                             │
│  ✅ Used for authentication                                │
│  ✅ Never logged or exposed                                │
│  ✅ Automatically masked in output                         │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Logging

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions UI                        │
│                                                             │
│  Workflow Runs                                              │
│  ├─ ✅ read-config (10s)                                   │
│  ├─ ✅ lint (45s)                                          │
│  ├─ ✅ build-and-push (2m 30s)                             │
│  ├─ ✅ deploy-to-ec2 (1m 15s)                              │
│  └─ ⏭️ deployment-skipped                                  │
│                                                             │
│  Logs available for each job                                │
│  Artifacts can be uploaded                                  │
└─────────────────────────────────────────────────────────────┘
```

## Rollback Strategy

### If Deployment Fails

1. **Immediate**: Manually deploy previous image
   ```bash
   ssh ec2-user@host
   docker pull user/agriconnect-frontend:previous-tag
   docker compose up -d
   ```

2. **Via Pipeline**: Revert commit and push
   ```bash
   git revert HEAD
   git push
   ```

3. **Manual Override**: Use workflow dispatch with specific tag

### If Build Fails

1. Fix code locally
2. Push fix
3. Pipeline automatically retries

## Performance Metrics

### Old Workflow
- Build time: ~3-5 minutes (on EC2)
- EC2 CPU usage: High during build
- No image backup
- Always deploys

### New Workflow
- Build time: ~2-3 minutes (on GitHub)
- EC2 CPU usage: Low (only pulls)
- Image backed up on Docker Hub
- Conditional deployment
- Parallel job execution

## Cost Optimization

```
GitHub Actions (Free tier):
├─ 2,000 minutes/month for private repos
├─ Unlimited for public repos
└─ This workflow uses ~5-10 minutes per run

Docker Hub (Free tier):
├─ Unlimited public repositories
├─ 1 private repository
└─ 200 pulls per 6 hours (unauthenticated)

EC2 Instance:
├─ Reduced CPU usage (no builds)
├─ Faster deployments (pull vs build)
└─ Lower disk usage (no build cache)
```

---

**Last Updated:** April 21, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
