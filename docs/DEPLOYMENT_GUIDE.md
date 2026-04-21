# Deployment Feature Flag Guide

## Overview

The CI/CD pipeline now supports **conditional deployment** via a configuration file. This allows you to control whether changes are deployed to EC2 or just built and pushed to Docker Hub.

## Pipeline Modes

### 🚀 Full CI/CD (ENABLE_DEPLOYMENT: true)
```
Lint → Build Docker Image → Push to Docker Hub → Deploy to EC2
```

### 📦 CI Only (ENABLE_DEPLOYMENT: false)
```
Lint → Build Docker Image → Push to Docker Hub → ⏭️ Skip EC2 Deployment
```

## Configuration File

**File:** `.deployment-config.yml`

```yaml
ENABLE_DEPLOYMENT: true   # or false
```

### Values

- **`true`** - Full CI/CD pipeline (deploy to EC2)
- **`false`** - CI only (skip EC2 deployment)

## How to Use

### Disable Deployment

1. Open `.deployment-config.yml`
2. Change to: `ENABLE_DEPLOYMENT: false`
3. Commit and push:
   ```bash
   git add .deployment-config.yml
   git commit -m "chore: disable deployment"
   git push
   ```
4. Pipeline will run CI only (no EC2 deployment)

### Enable Deployment

1. Open `.deployment-config.yml`
2. Change to: `ENABLE_DEPLOYMENT: true`
3. Commit and push:
   ```bash
   git add .deployment-config.yml
   git commit -m "chore: enable deployment"
   git push
   ```
4. Pipeline will run full CI/CD (deploy to EC2)

## Pipeline Jobs

### Job 1: Read Configuration ⚙️
- Reads `.deployment-config.yml`
- Determines if deployment should run
- Outputs decision to other jobs

### Job 2: Lint 🔍
- Runs ESLint on code
- **Always runs** (unless manually skipped)

### Job 3: Build & Push 🐳
- Builds Docker image
- Pushes to Docker Hub
- **Always runs** (regardless of deployment flag)

### Job 4: Deploy to EC2 🚀
- Pulls image from Docker Hub
- Restarts container on EC2
- **Conditional** - Only runs if `ENABLE_DEPLOYMENT: true`

### Job 5: Deployment Skipped ⏭️
- Shows notification when deployment is skipped
- **Conditional** - Only runs if `ENABLE_DEPLOYMENT: false`

## Manual Override

You can force deployment via GitHub Actions UI:

1. Go to **Actions** tab in GitHub
2. Select **CI/CD Pipeline**
3. Click **Run workflow**
4. Set `force_deploy: true`
5. Click **Run workflow**

This will deploy even if `.deployment-config.yml` has `ENABLE_DEPLOYMENT: false`

## Use Cases

### Development Phase
```yaml
# .deployment-config.yml
ENABLE_DEPLOYMENT: false
```
- Build and test Docker images
- Push to Docker Hub for testing
- Don't disrupt production

### Bug Fix / Hotfix
```yaml
# .deployment-config.yml
ENABLE_DEPLOYMENT: true
```
- Quick deployment to production
- Full CI/CD pipeline

### Feature Branch Testing
```yaml
# .deployment-config.yml
ENABLE_DEPLOYMENT: false
```
- Test builds without deploying
- Verify Docker image creation

### Production Release
```yaml
# .deployment-config.yml
ENABLE_DEPLOYMENT: true
```
- Deploy to production
- Full verification

## Workflow Comparison

### Old Workflow (deploy.yml)
- Always deploys to EC2
- No conditional logic
- Build happens on EC2

### New Workflow (ci-cd-pipeline.yml)
- ✅ Conditional deployment
- ✅ Build on GitHub Actions
- ✅ Push to Docker Hub
- ✅ Pull on EC2 (faster)
- ✅ Manual override option
- ✅ Clear status messages

## Migration Steps

1. **Keep both workflows** initially (for safety)
2. **Test new workflow** with `ENABLE_DEPLOYMENT: false`
3. **Verify Docker Hub** has images
4. **Test deployment** with `ENABLE_DEPLOYMENT: true`
5. **Delete old workflow** once confident:
   ```bash
   git rm .github/workflows/deploy.yml
   git commit -m "chore: remove old deployment workflow"
   git push
   ```

## Troubleshooting

### Deployment not running when enabled

**Check:**
1. `.deployment-config.yml` has `ENABLE_DEPLOYMENT: true`
2. File is committed and pushed
3. Check Actions tab for job status
4. Look for "Read Deployment Config" job output

### Docker image not found on EC2

**Solution:**
1. Verify image pushed to Docker Hub
2. Check Docker Hub credentials in secrets
3. Ensure EC2 can pull from Docker Hub

### Syntax error in config file

**Fix:**
```yaml
# ❌ Wrong
ENABLE_DEPLOYMENT:true

# ✅ Correct
ENABLE_DEPLOYMENT: true
```

## Best Practices

1. **Default to false** during active development
2. **Enable for releases** only
3. **Use manual override** for hotfixes
4. **Document changes** in commit messages
5. **Test locally** before pushing

## Environment Variables

The pipeline uses these GitHub Secrets:

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | EC2 instance IP address |
| `EC2_USERNAME` | SSH username (e.g., ubuntu) |
| `EC2_SSH_PRIVATE_KEY` | Private key for SSH access |
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password/token |

## Monitoring

### Check Pipeline Status

1. Go to **Actions** tab
2. Click on latest workflow run
3. View job statuses:
   - ✅ Green = Success
   - ❌ Red = Failed
   - ⏭️ Gray = Skipped

### Check Deployment Decision

Look for "Read Deployment Config" job output:
```
📋 Deployment config: ENABLE_DEPLOYMENT=false
🔕 Deployment DISABLED
```

or

```
📋 Deployment config: ENABLE_DEPLOYMENT=true
🚀 Deployment ENABLED (config file)
```

## Security Considerations

1. **Config file is public** - Don't put secrets here
2. **Secrets stay in GitHub** - Use GitHub Secrets
3. **EC2 access controlled** - SSH key required
4. **Docker Hub private** - Credentials required

## Advanced Usage

### Conditional Deployment by Branch

Edit `.deployment-config.yml` based on branch:

**main branch:**
```yaml
ENABLE_DEPLOYMENT: true
```

**develop branch:**
```yaml
ENABLE_DEPLOYMENT: false
```

### Multiple Environments

Create separate config files:
- `.deployment-config.prod.yml`
- `.deployment-config.staging.yml`

Update workflow to read appropriate file.

## FAQ

**Q: What happens to Docker images when deployment is disabled?**  
A: They are still built and pushed to Docker Hub. Only EC2 deployment is skipped.

**Q: Can I deploy manually without changing the config file?**  
A: Yes, use workflow dispatch with `force_deploy: true`

**Q: Will this affect my current deployments?**  
A: No, the new workflow is separate. Old workflow still works.

**Q: How do I know if deployment ran?**  
A: Check the Actions tab. Look for "Deploy to EC2" or "Deployment Skipped" job.

**Q: Can I use this for staging environments?**  
A: Yes, create separate workflows for different environments.

## Support

For issues:
1. Check Actions tab for error logs
2. Verify `.deployment-config.yml` syntax
3. Ensure all GitHub Secrets are set
4. Check EC2 instance is running

---

**Last Updated:** April 21, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
