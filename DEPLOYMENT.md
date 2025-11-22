# Deployment Guide for Vercel

## Prerequisites Checklist

### 1. MongoDB Atlas Setup
- [ ] Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create a free cluster
- [ ] Create a database user (username/password)
- [ ] Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
- [ ] Add network access (add `0.0.0.0/0` for all IPs, or Vercel's IP ranges)

### 2. Environment Variables Required
Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/food-view` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_jwt_key_123` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | `public_xxx` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | `private_xxx` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | `https://ik.imagekit.io/yourname` |
| `FRONTEND_URL` | Your frontend URL for CORS | `https://your-frontend.vercel.app` |

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your project or create a new one
   - **Important**: When asked for the root directory, make sure it's set to `backend` (or `.` if you're already in the backend folder)

5. **Set Environment Variables** (if not done via dashboard):
   ```bash
   vercel env add MONGODB_URL
   vercel env add JWT_SECRET
   vercel env add IMAGEKIT_PUBLIC_KEY
   vercel env add IMAGEKIT_PRIVATE_KEY
   vercel env add IMAGEKIT_URL_ENDPOINT
   vercel env add FRONTEND_URL
   ```

6. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to Vercel Dashboard**: https://vercel.com/dashboard

3. **Import Project**:
   - Click "Add New" → "Project"
   - Import your repository
   - **Root Directory**: Set to `backend`
   - Framework Preset: Other (or leave as default)

4. **Set Environment Variables**:
   - Go to Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to set them for Production, Preview, and Development

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## Post-Deployment Verification

1. **Check Deployment Logs**:
   - Go to your project in Vercel Dashboard
   - Click on the latest deployment
   - Check "Functions" tab for any errors

2. **Test Your API**:
   ```bash
   # Test root endpoint
   curl https://your-backend.vercel.app/
   
   # Should return: "hello"
   ```

3. **Test Database Connection**:
   - Make a test API call (e.g., register user or get food items)
   - Check Vercel function logs for "MongoDB connected successfully"

4. **Common Issues**:
   - **FUNCTION_INVOCATION_FAILED**: Check environment variables are set correctly
   - **Database connection fails**: Verify MongoDB Atlas network access and connection string
   - **CORS errors**: Make sure `FRONTEND_URL` matches your frontend domain exactly

## Updating Frontend API URL

After deployment, update your frontend's `.env` file:

```env
VITE_API_URL=https://your-backend.vercel.app
```

Or set it in your frontend's Vercel environment variables if deploying frontend too.

## Troubleshooting

### Function Logs
- Go to Vercel Dashboard → Your Project → Functions tab
- Click on any function to see logs
- Look for error messages

### Common Errors

**"MONGODB_URL environment variable is not set"**
- Solution: Add `MONGODB_URL` in Vercel environment variables

**"Database connection failed"**
- Solution: Check MongoDB Atlas connection string and network access

**"CORS error"**
- Solution: Verify `FRONTEND_URL` matches your frontend domain exactly (including https://)

**"JWT_SECRET is required"**
- Solution: Add `JWT_SECRET` in Vercel environment variables

