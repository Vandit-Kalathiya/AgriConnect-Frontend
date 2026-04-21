# GitHub Actions Workflows

## Available Workflows

### 1. `ci-cd-pipeline.yml` ✅ NEW (Recommended)
**Status:** Active  
**Purpose:** Conditional CI/CD with deployment feature flag

**Features:**
- ✅ Conditional deployment via `.deployment-config.yml`
- ✅ Always builds and pushes to Docker Hub
- ✅ Deploys to EC2 only when enabled
- ✅ Manual override option
- ✅ Clear status messages

**Trigger:**
- Push to `main` or `master` branch
- Manual workflow dispatch

**Jobs:**
1. Read deployment configuration
2. Lint code (ESLint)
3. Build and push Docker image
4. Deploy to EC2 (conditional)
5. Show skip message (conditional)

---

### 2. `deploy.yml` ⚠️ OLD (Deprecated)
**Status:** Can be disabled/deleted  
**Purpose:** Original deployment workflow

**Features:**
- Always deploys to EC2
- Builds on EC2
- No Docker Hub push

**Migration:**
- New workflow is ready to use
- Test new workflow first
- Delete this file when confident

---

## Quick Start

### Use New Workflow

1. **Disable deployment** (CI only):
   ```yaml
   # .deployment-config.yml
   ENABLE_DEPLOYMENT: false
   ```

2. **Enable deployment** (Full CI/CD):
   ```yaml
   # .deployment-config.yml
   ENABLE_DEPLOYMENT: true
   ```

3. **Force deploy** (Manual override):
   - Go to Actions tab
   - Select "CI/CD Pipeline"
   - Click "Run workflow"
   - Set `force_deploy: true`

---

## Workflow Comparison

| Feature | Old (`deploy.yml`) | New (`ci-cd-pipeline.yml`) |
|---------|-------------------|---------------------------|
| Conditional deployment | ❌ No | ✅ Yes |
| Build location | EC2 | GitHub Actions |
| Docker Hub push | ❌ No | ✅ Yes |
| Manual override | ❌ No | ✅ Yes |
| Build speed | Slower | Faster |
| EC2 resource usage | High | Low |
| Image backup | ❌ No | ✅ Yes |

---

## Migration Steps

1. ✅ New workflow file created
2. ⏳ Test with deployment disabled
3. ⏳ Test with deployment enabled
4. ⏳ Verify everything works
5. ⏳ Disable/delete old workflow

See `MIGRATION_CHECKLIST.md` for detailed steps.

---

## Documentation

- **Quick Start:** `QUICK_DEPLOYMENT.md`
- **Full Guide:** `DEPLOYMENT_GUIDE.md`
- **Architecture:** `DEPLOYMENT_ARCHITECTURE.md`
- **Migration:** `MIGRATION_CHECKLIST.md`
- **Summary:** `DEPLOYMENT_SUMMARY.md`

---

## Support

For issues or questions:
1. Check documentation files
2. Review workflow run logs in Actions tab
3. Verify GitHub Secrets are set
4. Check `.deployment-config.yml` syntax

---

**Last Updated:** April 21, 2026  
**Recommended Workflow:** `ci-cd-pipeline.yml`
