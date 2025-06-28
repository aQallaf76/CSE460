# 🚀 Sundevil Cafeteria - Complete Deployment Guide

This guide will help you deploy your entire Sundevil Cafeteria application online with both frontend and backend hosted.

## 📋 **Deployment Overview**

- **Frontend (React)**: Netlify (Free hosting)
- **Backend (Node.js)**: Render (Free hosting)
- **Database**: SQLite (included with backend)

## 🎯 **Step 1: Deploy Backend to Render**

### 1.1 Prepare Backend Repository
```bash
# Navigate to backend directory
cd backend

# Ensure all dependencies are installed
npm install

# Test locally
npm start
```

### 1.2 Deploy to Render

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `sundevil-cafeteria-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `10000`

6. **Click "Create Web Service"**

### 1.3 Get Backend URL
After deployment, Render will provide a URL like:
`https://sundevil-cafeteria-backend.onrender.com`

**Save this URL - you'll need it for frontend deployment!**

## 🎯 **Step 2: Deploy Frontend to Netlify**

### 2.1 Prepare Frontend Repository
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Test build locally
npm run build
```

### 2.2 Deploy to Netlify

1. **Go to [Netlify.com](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Connect your GitHub repository**
4. **Configure the build:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

5. **Add Environment Variables:**
   - `REACT_APP_API_URL`: `https://sundevil-cafeteria-backend.onrender.com`

6. **Click "Deploy site"**

### 2.3 Custom Domain (Optional)
Netlify will provide a random URL. You can:
- **Customize the subdomain** in site settings
- **Add a custom domain** if you have one

## 🔧 **Step 3: Update CORS Settings**

After both deployments are complete, update the backend CORS settings:

1. **Go to your Render dashboard**
2. **Find your backend service**
3. **Go to Environment Variables**
4. **Add/Update:**
   - `FRONTEND_URL`: Your Netlify URL (e.g., `https://sundevil-cafeteria.netlify.app`)

## 🧪 **Step 4: Test Your Deployment**

### Test Backend API
```bash
curl https://sundevil-cafeteria-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Sundevil Cafeteria API is running",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Frontend
1. **Visit your Netlify URL**
2. **Test all features:**
   - Login with different roles
   - Browse menu
   - Place orders
   - Check order tracking
   - Admin dashboard

## 🔄 **Step 5: Continuous Deployment**

Both Render and Netlify will automatically redeploy when you push changes to your GitHub repository.

## 🚨 **Troubleshooting**

### Backend Issues
- **Check Render logs** for deployment errors
- **Verify environment variables** are set correctly
- **Test API endpoints** using curl or Postman

### Frontend Issues
- **Check Netlify build logs** for compilation errors
- **Verify API URL** is correct in environment variables
- **Clear browser cache** and try again

### CORS Issues
- **Update backend CORS settings** with correct frontend URL
- **Check browser console** for CORS error messages

## 📊 **Monitoring**

### Render Dashboard
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory usage
- **Deployments**: Build and deployment history

### Netlify Dashboard
- **Deployments**: Build status and history
- **Analytics**: Site traffic and performance
- **Forms**: Form submissions (if any)

## 🔐 **Security Considerations**

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Only allow your frontend domain
3. **Rate Limiting**: Consider adding rate limiting for production
4. **HTTPS**: Both services provide HTTPS by default

## 📱 **Mobile Testing**

Test your deployed application on:
- **Mobile browsers** (Chrome, Safari)
- **Tablets** (iPad, Android tablets)
- **Different screen sizes**

## 🎉 **Success!**

Your Sundevil Cafeteria application is now live online! Share your URLs:

- **Frontend**: `https://your-app.netlify.app`
- **Backend API**: `https://your-backend.onrender.com`

## 📞 **Support**

If you encounter issues:
1. **Check the logs** in both Render and Netlify dashboards
2. **Verify all environment variables** are set correctly
3. **Test API endpoints** individually
4. **Clear browser cache** and try again

---

**Happy Deploying! 🚀** 