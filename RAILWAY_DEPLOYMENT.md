# 🚀 Railway Deployment Guide for CodeWizard

## Quick Deploy (Recommended)

### Method 1: GitHub Integration (Easiest)
1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your CodeWizard repository
   - Railway will auto-detect configuration and deploy!

### Method 2: Railway CLI
1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

## 🔧 Configuration Details

Your project is already configured with:
- ✅ `railway.json` - Railway configuration
- ✅ `Dockerfile` - Container setup
- ✅ Health check endpoint: `/api/health`
- ✅ Auto-restart on failure
- ✅ Proper port configuration

## 🌐 After Deployment

1. **Your app will be available at**: `https://your-app-name.railway.app`
2. **API endpoints**:
   - Health: `https://your-app-name.railway.app/api/health`
   - Compile: `https://your-app-name.railway.app/api/compile`
3. **Web interface**: Upload your `web-interface-mockup.html` or serve it statically

## 🛠️ Environment Variables (if needed)
- `PORT` - Automatically set by Railway
- `NODE_ENV` - Set to "production"

## 📊 Monitoring
- Railway provides built-in logs and metrics
- Health check runs every 30 seconds
- Auto-restart on failure (max 10 retries)
