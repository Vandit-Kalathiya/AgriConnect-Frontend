# AgriConnect Frontend

React + Vite application for AgriConnect platform.

## 🚀 Quick Start

### Notifications

- [QUICK_START_NOTIFICATIONS.md](./QUICK_START_NOTIFICATIONS.md) - Quick notification setup

### Deployment

- [QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md) - Quick deployment commands

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- **Deployment & CI/CD** - Pipeline setup, feature flags, migration guides
- **Notification System** - Architecture, feature flags, implementation
- **AI Integration** - AI features and persistence guides

See [`docs/README.md`](./docs/README.md) for the complete documentation index.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 📦 Docker

```bash
# Build image
docker build -t agriconnect-frontend .

# Run container
docker compose up -d
```

## 🔧 Configuration

- `.env` - Environment variables (not committed)
- `.env.example` - Environment template
- `.deployment-config.yml` - Deployment feature flag

## 📖 Tech Stack

- React 18
- Vite
- Zustand (State Management)
- React Router
- Tailwind CSS
- Docker
