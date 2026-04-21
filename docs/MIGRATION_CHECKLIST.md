# Migration Checklist: Old → New CI/CD Pipeline

## Pre-Migration

### ✅ Backup Current Setup
- [ ] Document current workflow behavior
- [ ] Note any custom configurations
- [ ] Save current `.github/workflows/deploy.yml`
- [ ] Verify current deployment works

### ✅ Verify Prerequisites
- [ ] GitHub Secrets are set:
  - [ ] `EC2_HOST`
  - [ ] `EC2_USERNAME`
  - [ ] `EC2_SSH_PRIVATE_KEY`
  - [ ] `DOCKER_USERNAME`
  - [ ] `DOCKER_PASSWORD`
- [ ] EC2 instance is running
- [ ] Docker Hub account is active
- [ ] SSH access to EC2 works

## Migration Steps

### Step 1: Add New Files ✅ COMPLETED
- [x] `.deployment-config.yml` created
- [x] `.github/workflows/ci-cd-pipeline.yml` created
- [x] Documentation files created

### Step 2: Test New Workflow (Disabled Mode)
- [ ] Set `ENABLE_DEPLOYMENT: false` in `.deployment-config.yml`
- [ ] Commit and push:
  ```bash
  git add .deployment-config.yml .github/workflows/ci-cd-pipeline.yml
  git commit -m "feat: add conditional deployment pipeline"
  git push
  ```
- [ ] Go to GitHub Actions tab
- [ ] Verify new workflow runs
- [ ] Check all jobs:
  - [ ] `read-config` completes
  - [ ] `lint` passes
  - [ ] `build-and-push` succeeds
  - [ ] `deployment-skipped` shows message
  - [ ] `deploy-to-ec2` is skipped

### Step 3: Verify Docker Hub
- [ ] Go to Docker Hub: `https://hub.docker.com/r/YOUR_USERNAME/agriconnect-frontend`
- [ ] Verify new image was pushed
- [ ] Check image tags (latest, branch-sha)
- [ ] Note image size and timestamp

### Step 4: Test New Workflow (Enabled Mode)
- [ ] Set `ENABLE_DEPLOYMENT: true` in `.deployment-config.yml`
- [ ] Commit and push:
  ```bash
  git add .deployment-config.yml
  git commit -m "test: enable deployment in new pipeline"
  git push
  ```
- [ ] Go to GitHub Actions tab
- [ ] Verify new workflow runs
- [ ] Check all jobs:
  - [ ] `read-config` shows enabled
  - [ ] `lint` passes
  - [ ] `build-and-push` succeeds
  - [ ] `deploy-to-ec2` runs successfully
  - [ ] `deployment-skipped` is skipped

### Step 5: Verify EC2 Deployment
- [ ] SSH to EC2:
  ```bash
  ssh -i your-key.pem ubuntu@YOUR_EC2_IP
  ```
- [ ] Check container status:
  ```bash
  cd ~/AgriConnect_Frontend
  docker compose ps
  ```
- [ ] Check container logs:
  ```bash
  docker compose logs -f
  ```
- [ ] Test application:
  ```bash
  curl http://localhost:5000
  ```
- [ ] Visit production URL: `https://agriconnectme.shop`

### Step 6: Test Manual Override
- [ ] Set `ENABLE_DEPLOYMENT: false` in config
- [ ] Commit and push
- [ ] Go to GitHub Actions → CI/CD Pipeline
- [ ] Click "Run workflow"
- [ ] Set `force_deploy: true`
- [ ] Click "Run workflow"
- [ ] Verify deployment runs despite config being false

### Step 7: Disable Old Workflow
- [ ] Rename old workflow:
  ```bash
  git mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
  git commit -m "chore: disable old deployment workflow"
  git push
  ```
- [ ] Verify only new workflow runs on next push

### Step 8: Monitor for Issues
- [ ] Make a small change (e.g., README update)
- [ ] Push with `ENABLE_DEPLOYMENT: false`
- [ ] Verify CI runs, deployment skipped
- [ ] Push with `ENABLE_DEPLOYMENT: true`
- [ ] Verify full CI/CD runs
- [ ] Check application still works

### Step 9: Clean Up (Optional)
- [ ] Delete old workflow file:
  ```bash
  git rm .github/workflows/deploy.yml.disabled
  git commit -m "chore: remove old deployment workflow"
  git push
  ```
- [ ] Update README with new workflow info
- [ ] Notify team of new deployment process

## Post-Migration

### ✅ Documentation
- [ ] Update team wiki/docs
- [ ] Share `QUICK_DEPLOYMENT.md` with team
- [ ] Document any custom changes
- [ ] Add deployment guide to onboarding

### ✅ Training
- [ ] Show team how to toggle deployment
- [ ] Explain manual override feature
- [ ] Demonstrate checking workflow status
- [ ] Review troubleshooting steps

### ✅ Monitoring
- [ ] Set up alerts for failed deployments
- [ ] Monitor first few deployments closely
- [ ] Track deployment times
- [ ] Gather team feedback

## Rollback Plan

If new workflow causes issues:

### Quick Rollback
```bash
# Re-enable old workflow
git mv .github/workflows/deploy.yml.disabled .github/workflows/deploy.yml

# Disable new workflow
git mv .github/workflows/ci-cd-pipeline.yml .github/workflows/ci-cd-pipeline.yml.disabled

# Commit and push
git add .github/workflows/
git commit -m "rollback: revert to old deployment workflow"
git push
```

### Manual Deployment
```bash
# SSH to EC2
ssh -i key.pem ubuntu@YOUR_EC2_IP

# Pull and deploy manually
cd ~/AgriConnect_Frontend
git pull
docker build -t username/agriconnect-frontend:latest .
docker compose up -d
```

## Verification Checklist

### After Each Deployment
- [ ] Application loads in browser
- [ ] No console errors
- [ ] API calls work
- [ ] Authentication works
- [ ] All features functional

### Weekly Checks
- [ ] Review workflow run times
- [ ] Check Docker Hub storage
- [ ] Verify EC2 disk space
- [ ] Review failed workflows
- [ ] Update documentation if needed

## Common Issues & Solutions

### Issue: Workflow not triggering
**Solution:**
- Check branch name (main/master)
- Verify workflow file syntax
- Check GitHub Actions is enabled

### Issue: Docker build fails
**Solution:**
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Check build logs for errors

### Issue: Docker push fails
**Solution:**
- Verify Docker Hub credentials
- Check Docker Hub is not down
- Verify repository exists

### Issue: EC2 deployment fails
**Solution:**
- Check SSH key is correct
- Verify EC2 is running
- Check EC2 security groups
- Verify disk space on EC2

### Issue: Container won't start
**Solution:**
- Check container logs
- Verify .env file on EC2
- Check port 5000 is available
- Verify Docker Compose syntax

## Success Criteria

Migration is successful when:
- [x] New workflow file exists
- [ ] CI runs successfully with deployment disabled
- [ ] Docker images pushed to Docker Hub
- [ ] Full CI/CD runs with deployment enabled
- [ ] Application deploys to EC2 correctly
- [ ] Manual override works
- [ ] Old workflow disabled
- [ ] Team trained on new process
- [ ] Documentation updated

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Setup | 30 min | ✅ Complete |
| Testing (disabled) | 15 min | ⏳ Pending |
| Testing (enabled) | 15 min | ⏳ Pending |
| Verification | 30 min | ⏳ Pending |
| Cleanup | 15 min | ⏳ Pending |
| **Total** | **~2 hours** | **In Progress** |

## Notes

- Keep both workflows running for 1-2 weeks during transition
- Monitor closely for first week
- Gather team feedback
- Document any issues and solutions
- Update this checklist based on experience

---

**Migration Started:** April 21, 2026  
**Expected Completion:** April 21, 2026  
**Status:** Setup Complete, Testing Pending
