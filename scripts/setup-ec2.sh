#!/usr/bin/env bash
# =============================================================================
# EC2 One-Time Setup Script — AgriConnect Frontend (Docker mode)
# Run this ONCE on a fresh Ubuntu 22.04 / 24.04 EC2 instance.
#
# Usage:
#   chmod +x setup-ec2.sh
#   sudo ./setup-ec2.sh
# =============================================================================

set -euo pipefail

DEPLOY_USER="${SUDO_USER:-ubuntu}"
APP_DIR="/home/$DEPLOY_USER/AgriConnect_Frontend"

echo "==> Updating system packages..."
apt-get update -y
apt-get upgrade -y

# ── Install Docker Engine ─────────────────────────────────────────────────────
echo "==> Installing Docker..."
apt-get install -y ca-certificates curl gnupg lsb-release

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# ── Allow deploy user to run Docker without sudo ──────────────────────────────
usermod -aG docker "$DEPLOY_USER"

# ── Enable Docker on boot ─────────────────────────────────────────────────────
systemctl enable docker
systemctl start docker

# ── Create app directory ──────────────────────────────────────────────────────
echo "==> Creating app directory: $APP_DIR"
mkdir -p "$APP_DIR"
chown "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"

# ── UFW: open HTTP (port 80) ──────────────────────────────────────────────────
if command -v ufw &>/dev/null; then
    echo "==> Configuring UFW..."
    ufw allow OpenSSH
    ufw allow 5000/tcp
    ufw --force enable
fi

# ── Verify ────────────────────────────────────────────────────────────────────
docker --version
docker compose version

echo ""
echo "============================================================"
echo "  EC2 setup complete!"
echo ""
echo "  App dir : $APP_DIR"
echo ""
echo "  GitHub Secrets to add (only 3 needed):"
echo "  ─────────────────────────────────────────────────────────"
echo "  EC2_HOST                  13.126.199.8"
echo "  EC2_USERNAME              $DEPLOY_USER"
echo "  EC2_SSH_PRIVATE_KEY       Contents of your .pem key file"
echo "  ─────────────────────────────────────────────────────────"
echo "  VITE_* vars live in .env on this EC2 instance at:"
echo "  $APP_DIR/.env"
echo ""
echo "  NOTE: Log out and back in for Docker group to take effect."
echo "============================================================"
