# Lead Management System

A full-stack Lead Management System built with React, Express.js, and PostgreSQL. Features include JWT authentication with httpOnly cookies, CRUD operations for leads, server-side pagination and filtering, and a professional data grid interface.

## Live Demo

- **Frontend**: lead-management-system1-git-main-280205s-projects.vercel.app
- **Backend API**:  lead-management-system1-production.up.railway.app

## Test Credentials

- **Email**: admin@leadmanagement.co.in
- **Password**: password123

## Tech Stack

### Frontend
- React 18
- AG Grid (Data Grid)
- React Hook Form
- React Router DOM
- Axios
- React Hot Toast

### Backend
- Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- bcryptjs for password hashing
- Cookie-based authentication (httpOnly)
- Express Validator
- Helmet + CORS security

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL (Render/Railway/Supabase)

## Features

### Authentication
- Use registration and login
- JWT tokens stored in httpOnly cookies (not localStorage)
- Secure password hashing with bcryptjs
- Protected routes with proper 401 responses
- Auto logout on token expiry

### Lead Management (CRUD)
- Create, Read, Update, Delete leads
- All required fields as per specification
- Proper HTTP status codes (201, 200, 401, 404, etc.)
- Input validation and error handling

### Data Grid & Pagination
- Professional AG Grid interface
- Server-side pagination (configurable page sizes)
- Sortable columns
- Responsive design

### Advanced Filtering
- Server-side filtering with multiple operators:
  - **String fields**: equals, contains
  - **Enums**: equals, in
  - **Numbers**: equals, gt, lt, between
  - **Dates**: on, before, after, between
  - **Boolean**: equals
- Multiple filters with AND logic
-  Real-time filter application

### UI/UX
- Clean, professional interface
- Loading states and error handling
- Toast notifications
- Modal forms for create/edit
- Responsive grid layout

## Project Structure

```
lead-management-system/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express server
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT authentication
│   │   │   └── errorHandler.js   # Global error handling
│   │   ├── routes/
│   │   │   ├── auth.js           # Auth routes
│   │   │   └── leads.js          # Lead CRUD routes
│   │   └── scripts/
│   │       └── seed.js           # Database seeding
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js      # Main dashboard with AG Grid
│   │   │   ├── LeadForm.js       # Create/Edit lead form
│   │   │   ├── FilterPanel.js    # Advanced filtering
│   │   │   ├── Login.js          # Login component
│   │   │   └── Register.js       # Registration component
│   │   ├── App.js                # Main app with auth context
│   │   └── index.js              # React entry point
│   ├── package.json
│   └── public/
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

3. **Database Setup**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npm run seed  # Creates test user and 150+ sample leads
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   ```bash
   # .env.local is already configured for development
   # Update .env.production for deployment
   ```

3. **Start Development Server**
   ```bash
   npm start
   # App runs on http://localhost:3000
   ```

## API Endpoints

### Authentication
```
POST /api/auth/register  # Register new user
POST /api/auth/login     # Login user
POST /api/auth/logout    # Logout user
GET  /api/auth/me        # Get current user
```

### Leads
```
POST   /api/leads        # Create lead
GET    /api/leads        # List leads (with pagination & filters)
GET    /api/leads/:id    # Get single lead
PUT    /api/leads/:id    # Update lead
DELETE /api/leads/:id    # Delete lead
```

### Pagination Parameters
```
?page=1&limit=20
```

### Filter Parameters
```
?filter_email={"operator":"contains","value":"john"}
?filter_status={"operator":"equals","value":"NEW"}
?filter_score={"operator":"between","value":50,"value2":90}
```

## Lead Model

```javascript
{
  id: string,
  firstName: string,
  lastName: string,
  email: string (unique),
  phone: string?,
  company: string?,
  city: string?,
  state: string?,
  source: enum(WEBSITE, FACEBOOK_ADS, GOOGLE_ADS, REFERRAL, EVENTS, OTHER),
  status: enum(NEW, CONTACTED, QUALIFIED, LOST, WON),
  score: number(0-100),
  leadValue: number?,
  lastActivityAt: datetime?,
  isQualified: boolean,
  createdAt: datetime,
  updatedAt: datetime
}
```

## Security Features

- JWT tokens in httpOnly cookies (XSS protection)
- Password hashing with bcryptjs
- CORS configuration
- Helmet.js security headers
- Rate limiting
- Input validation and sanitization
- SQL injection protection (Prisma ORM)

## Deployment

### Backend (Render/Railway/Fly.io)

1. **Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_secure_jwt_secret
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

2. **Build Command**
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```

3. **Start Command**
   ```bash
   npm start
   ```

### Frontend (Vercel)

1. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Database Seeding in Production
```bash
npm run seed  # Run this after deployment to create test data
```

## Testing

### Test the deployed application with these scenarios:

1. **Authentication Flow**
   - Register new account
   - Login with test credentials
   - Access protected routes
   - Logout functionality

2. **Lead Management**
   - Create new leads
   - Edit existing leads
   - Delete leads
   - View lead details

3. **Pagination & Filtering**
   - Navigate through pages
   - Change page sizes
   - Apply various filters
   - Clear filters

4. **Security Testing**
   - Access API without authentication (should return 401)
   - Test XSS protection (httpOnly cookies)
   - Verify input validation

## Evaluation Checklist

- [x] JWT auth with httpOnly cookies (no localStorage)
- [x] CRUD for leads with correct status codes
- [x] Server-side pagination and filters working
- [x] Create/Edit/Delete reflect correctly in UI
- [x] Unauthorized requests return 401
- [x] Fully deployed (frontend + backend + DB)
- [x] 100+ test leads with test user account
- [x] Professional UI with AG Grid
- [x] All required lead fields implemented
- [x] Advanced filtering with multiple operators
- [x] Proper error handling and loading states

### Test Credentials (Production)
```
Email: admin@leadmanagement.co.in
Password: password123
```

** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions**

---

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---
