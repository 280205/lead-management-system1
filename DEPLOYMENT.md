# Lead Management System - Deployment Guide

This guide will help you deploy the Lead Management System to production with Vercel (frontend) and Render (backend).

## 🚀 Quick Deployment Steps

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)

## 📦 Backend Deployment (Render)

### 1. Push to GitHub
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `lead-management-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 3. Set Environment Variables on Render
Add these environment variables in Render dashboard:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-very-long-and-random
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_IN=7
FRONTEND_URL=https://your-app-name.vercel.app
DATABASE_URL=postgresql://username:password@hostname:port/database
```

### 4. Set up PostgreSQL Database
Render will provide you with a PostgreSQL database URL. Use it for the `DATABASE_URL` environment variable.

### 5. Run Database Migration & Seed
After deployment, go to Render dashboard → your service → "Shell" tab and run:
```bash
npx prisma migrate deploy
npm run seed
```

## 🌐 Frontend Deployment (Vercel)

### 1. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 2. Set Environment Variables on Vercel
Add this environment variable:
```
REACT_APP_API_URL=https://your-render-service-url.onrender.com/api
```

### 3. Update CORS Settings
After getting your Vercel URL, update the `FRONTEND_URL` environment variable on Render to match your Vercel deployment URL.

## 🧪 Testing the Deployment

### Test Credentials
```
Email: test@leadmanagement.com
Password: password123
```

### Verification Checklist
- [ ] Backend API is accessible at your Render URL
- [ ] Frontend loads at your Vercel URL
- [ ] Login works with test credentials
- [ ] 150+ leads are visible after login
- [ ] CRUD operations work (Create, Read, Update, Delete leads)
- [ ] Filtering works properly
- [ ] Pagination works
- [ ] Actions buttons (Edit/Delete) work

## 🔗 Example URLs Structure

- **Backend (Render)**: `https://lead-management-backend-xyz.onrender.com`
- **Frontend (Vercel)**: `https://lead-management-xyz.vercel.app`
- **API Health Check**: `https://your-backend-url.onrender.com/api/health`

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` in backend matches your Vercel URL
2. **Database Connection**: Verify `DATABASE_URL` is correct
3. **Build Failures**: Check that all dependencies are in `package.json`
4. **Seed Data Missing**: Run `npm run seed` in Render shell

### Health Check Endpoint
Visit `https://your-backend-url.onrender.com/api/health` to verify backend is running.

## 📋 Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel  
- [ ] Database migrations applied
- [ ] Seed data created (150+ leads)
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Test user can login
- [ ] All CRUD operations work
- [ ] Both apps are publicly accessible

## 🔒 Security Notes

- JWT secret is properly randomized
- Environment variables are set correctly
- Database credentials are secure
- CORS is configured for production domain only

---

**Ready for Production! 🚀**

Your Lead Management System is now deployed and ready for use with:
- ✅ 150+ sample leads
- ✅ Full CRUD functionality  
- ✅ Authentication system
- ✅ Professional UI with AG Grid
- ✅ Server-side pagination & filtering
