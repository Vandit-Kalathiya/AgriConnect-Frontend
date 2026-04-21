# Quick Deployment Reference

## TL;DR - Disable Deployment

```bash
# Edit .deployment-config.yml
ENABLE_DEPLOYMENT: false

# Commit and push
git add .deployment-config.yml
git commit -m "chore: disable deployment"
git push
```

**Result:** CI runs, Docker image pushed, EC2 deployment skipped ⏭️

---

## TL;DR - Enable Deployment

```bash
# Edit .deployment-config.yml
ENABLE_DEPLOYMENT: true

# Commit and push
git add .deployment-config.yml
git commit -m "chore: enable deployment"
git push
```

**Result:** Full CI/CD runs, deploys to EC2 🚀

---

## Pipeline Flow

### When ENABLED ✅
```
Push Code
    ↓
Lint Code ✅
    ↓
Build Docker Image ✅
    ↓
Push to Docker Hub ✅
    ↓
Deploy to EC2 ✅
    ↓
Verify Deployment ✅
```

### When DISABLED 🔕
```
Push Code
    ↓
Lint Code ✅
    ↓
Build Docker Image ✅
    ↓
Push to Docker Hub ✅
    ↓
Skip EC2 Deployment ⏭️
```

---

## Common Commands

### Check Current Config
```bash
cat .deployment-config.yml
```

### Disable Deployment
```bash
echo "ENABLE_DEPLOYMENT: false" > .deployment-config.yml
git add .deployment-config.yml
git commit -m "chore: disable deployment"
git push
```

### Enable Deployment
```bash
echo "ENABLE_DEPLOYMENT: true" > .deployment-config.yml
git add .deployment-config.yml
git commit -m "chore: enable deployment"
git push
```

### Force Deploy (Manual)
1. Go to GitHub → Actions
2. Click "Run workflow"
3. Set `force_deploy: true`
4. Click "Run workflow"

---

## Status Indicators

| Icon | Meaning |
|------|---------|
| ✅ | Job completed successfully |
| ❌ | Job failed |
| ⏭️ | Job skipped |
| 🔄 | Job running |

---

## Quick Checks

### Is deployment enabled?
```bash
grep ENABLE_DEPLOYMENT .deployment-config.yml
```

### View last workflow run
Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`

### Check if image was pushed
Go to: `https://hub.docker.com/r/YOUR_USERNAME/agriconnect-frontend`

---

## Troubleshooting

**Deployment not running?**
1. Check `.deployment-config.yml` has `true`
2. Verify file is committed
3. Check Actions tab for errors

**Image not on Docker Hub?**
1. Check Docker credentials in Secrets
2. Verify build job succeeded
3. Check Docker Hub manually

**EC2 not updating?**
1. Verify deployment job ran
2. Check EC2 is running
3. SSH to EC2 and check logs:
   ```bash
   docker compose logs -f
   ```

---

## File Location

```
.deployment-config.yml          # Config file (commit this)
.github/workflows/ci-cd-pipeline.yml  # New workflow
.github/workflows/deploy.yml    # Old workflow (can delete)
```

---

## Next Steps After Setup

1. ✅ Test with `ENABLE_DEPLOYMENT: false`
2. ✅ Verify Docker image pushed
3. ✅ Test with `ENABLE_DEPLOYMENT: true`
4. ✅ Verify EC2 deployment
5. ✅ Delete old `deploy.yml` workflow

---

## Need More Info?

- Full guide: `DEPLOYMENT_GUIDE.md`
- Workflow file: `.github/workflows/ci-cd-pipeline.yml`
- Config file: `.deployment-config.yml`
