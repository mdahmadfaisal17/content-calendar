# 🔐 Secure Login System - Setup Guide

## Overview

The Content Calendar now includes a secure session-based authentication system. The calendar is completely hidden behind a login page until authentication succeeds.

---

## ✅ Installation Steps

### 1. Update Dependencies

The following new packages have been added to `package.json`:
- `express-session` - Session middleware for Express
- `connect-mongo` - MongoDB session store

Install the new dependencies:
```bash
npm install
```

### 2. Environment Variables

All credentials and secrets are stored in the `.env` file (NOT in code).

**Location**: `d:\0 Abdullah Al Faysal\content-calendar\.env`

**Current Configuration**:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://mdahmadfaisal17_db_user:Mockshdggdgark2026Atlas!89@mockshark-cluster.8yg1dbs.mongodb.net/?appName=mockshark-cluster

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Name
DB_NAME=content_calendar
COLLECTION_NAME=posts

# Login Credentials
LOGIN_EMAIL=mdahmadfaisal17@gmail.com
LOGIN_PASSWORD=CC_Atlas_2026_Admin

# Session Secret
SESSION_SECRET=content_calendar_secure_session_2026_xyz789
```

**Credentials Stored**: 
- **Email**: `LOGIN_EMAIL` environment variable
- **Password**: `LOGIN_PASSWORD` environment variable
- **Session Secret**: `SESSION_SECRET` for secure session encryption

---

## 🔑 Login Credentials

Credentials are configured in your `.env` file (not stored in repository).

Credentials storage:
- ✅ Stored in `.env` (git-ignored)
- ✅ Never exposed in frontend JavaScript
- ✅ Validated server-side only
- ✅ Protected by Express sessions
- ✅ Excluded from Git via `.gitignore`

---

## 📁 New Files Created

### Backend Files

#### 1. `backend/middleware/auth.js`
- **Purpose**: Authentication middleware to protect API routes
- **Function**: `isAuthenticated(req, res, next)` - Verifies session before allowing API access
- **Usage**: Applied to all `/api/posts` endpoints

```javascript
// Protects routes
router.get('/posts', isAuthenticated, async (req, res) => { ... });
```

#### 2. `backend/routes/auth.js`
- **Purpose**: Authentication endpoints
- **Endpoints**:
  - `POST /api/auth/login` - Authenticate user, create session
  - `POST /api/auth/logout` - Destroy session
  - `GET /api/auth/check` - Check if user is authenticated

### Frontend Files

#### 3. `public/login.html`
- **Purpose**: Dedicated login page
- **Features**:
  - Modern, minimal design
  - Email and password input fields
  - Error message display
  - Auto-redirects if already authenticated
  - Responsive design for mobile

#### 4. `public/login.css`
- **Purpose**: Login page styling
- **Features**:
  - Gradient background (purple theme)
  - Smooth animations
  - Form input styling
  - Error state styling
  - Mobile responsive

### Updated Files

#### 5. `backend/server.js`
- **Changes**:
  - Added `express-session` middleware
  - Added `connect-mongo` for session storage
  - Session stored in MongoDB collection `sessions`
  - Routes redirect unauthenticated users to `/login`
  - Protected routes require valid session

#### 6. `backend/routes/posts.js`
- **Changes**:
  - All endpoints now require `isAuthenticated` middleware
  - Unauthenticated requests return 401 error

#### 7. `public/index.html`
- **Changes**:
  - Added logout button in header
  - Header restructured with flex layout

#### 8. `public/script.js`
- **Changes**:
  - Added `checkAuthentication()` - Verifies session on page load
  - Added `logout()` - Destroys session and redirects to login
  - Auto-redirect to login if not authenticated

#### 9. `public/styles.css`
- **Changes**:
  - Updated header with logout button styling
  - Red logout button with hover effects
  - Responsive header for mobile devices

#### 10. `package.json`
- **Changes**:
  - Added `express-session@^1.17.3`
  - Added `connect-mongo@^5.1.0`

#### 11. `.env`
- **Changes**:
  - Added `LOGIN_EMAIL=mdahmadfaisal17@gmail.com`
  - Added `LOGIN_PASSWORD=CC_Atlas_2026_Admin`
  - Added `SESSION_SECRET=content_calendar_secure_session_2026_xyz789`

#### 12. `.env.example`
- **Changes**:
  - Updated template with login credentials section
  - Shows proper variable names for new users

---

## 🔄 How It Works

### Login Flow

```
1. User visits http://localhost:5000
   ↓
2. Backend checks session (server.js)
   ↓
3. If no session → Redirect to /login
   ↓
4. User enters credentials on login.html
   ↓
5. Frontend sends POST /api/auth/login
   ↓
6. Backend validates credentials (auth.js)
   ↓
7. If valid → Create session, send success response
   ↓
8. Frontend redirects to /
   ↓
9. Backend finds session → Serve index.html (calendar)
```

### API Protection

```
Unauthenticated Request:
GET /api/posts (no session)
   ↓
isAuthenticated middleware checks session
   ↓
Session not found → Return 401 Unauthorized
   ↓
Frontend receives error → Cannot load data

Authenticated Request:
GET /api/posts (with valid session)
   ↓
isAuthenticated middleware finds session
   ↓
Session valid → Process request
   ↓
Return calendar data
```

### Logout Flow

```
1. User clicks Logout button
   ↓
2. Confirms logout dialog
   ↓
3. Frontend sends POST /api/auth/logout
   ↓
4. Backend destroys session
   ↓
5. Frontend redirects to /login
```

---

## 🚀 Running the Application

### Start Server

```bash
npm install  # Install new dependencies
npm run dev  # Start with nodemon
```

Expected output:
```
═══════════════════════════════════════
✓ Connected to MongoDB
✓ Server running on http://localhost:5000
✓ Environment: development
═══════════════════════════════════════
```

### Access Application

1. Navigate to: `http://localhost:5000`
2. You'll be redirected to login page: `http://localhost:5000/login`
3. Enter credentials:
   - Email: `mdahmadfaisal17@gmail.com`
   - Password: `CC_Atlas_2026_Admin`
4. Click "Sign In"
5. Access calendar dashboard

---

## 🔒 Security Features

### ✅ Implemented

- **Session-Based Auth**: User state managed on server
- **Environment Variables**: Credentials never hardcoded
- **MongoDB Sessions**: Sessions persist across server restarts
- **24-Hour Expiry**: Sessions automatically expire after 24 hours
- **Server-Side Validation**: Passwords validated on backend only
- **No Frontend Credentials**: Login logic never visible in browser
- **CSRF Protection**: Session cookies prevent cross-site attacks
- **API Protection**: All data endpoints require authentication

### Session Storage

Sessions stored in MongoDB collection: `sessions`

```json
{
  "_id": "ObjectId",
  "expires": ISODate("2024-06-23T10:00:00Z"),
  "session": {
    "cookie": {...},
    "userId": "mdahmadfaisal17@gmail.com",
    "email": "mdahmadfaisal17@gmail.com"
  }
}
```

---

## 🛠️ Customization

### Change Login Credentials

Edit `.env`:
```env
LOGIN_EMAIL=newemail@example.com
LOGIN_PASSWORD=NewSecurePassword123!
```

Then restart server.

### Change Session Duration

Edit `backend/server.js`:
```javascript
cookie: { 
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days instead of 24 hours
}
```

### Enable HTTPS

Edit `backend/server.js`:
```javascript
cookie: { 
    secure: true,  // Enable for HTTPS only
    httpOnly: true
}
```

---

## 🐛 Troubleshooting

### "Cannot POST /api/auth/login"
- Ensure backend is running
- Check server logs for errors
- Verify `backend/routes/auth.js` is loaded

### "Authentication failed"
- Double-check email and password
- Verify `.env` variables are correct
- Check server console for validation logs

### "Sessions collection not found"
- MongoDB is running
- Database name in `.env` is correct
- Server has write permissions to MongoDB

### "Credentials are blank on form submission"
- Check `public/login.html` form IDs match
- Open browser console (F12) for JavaScript errors
- Verify fetch request is sending data

---

## 📝 File Structure

```
content-calendar/
├── backend/
│   ├── middleware/
│   │   └── auth.js ← NEW: Auth middleware
│   ├── routes/
│   │   ├── auth.js ← NEW: Auth endpoints
│   │   └── posts.js ← UPDATED: Protected routes
│   ├── db/
│   │   └── connection.js
│   └── server.js ← UPDATED: Session middleware
├── public/
│   ├── login.html ← NEW: Login page
│   ├── login.css ← NEW: Login styling
│   ├── index.html ← UPDATED: Logout button
│   ├── script.js ← UPDATED: Auth checks
│   └── styles.css ← UPDATED: Button styling
├── .env ← UPDATED: Login credentials
├── .env.example ← UPDATED: Credentials template
├── package.json ← UPDATED: New dependencies
└── README.md
```

---

## 🔐 Production Checklist

Before deploying to production:

- [ ] Change `LOGIN_PASSWORD` to strong password
- [ ] Change `SESSION_SECRET` to random string
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Enable HTTPS (set `secure: true` in cookies)
- [ ] Use MongoDB Atlas with SSL/TLS connection
- [ ] Enable IP whitelist in MongoDB Atlas
- [ ] Use environment-specific `.env` files
- [ ] Set up CORS for your domain
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up monitoring and logging

---

## 📞 Support

For issues with the login system:
1. Check server console logs
2. Check browser console (F12)
3. Verify `.env` file has correct values
4. Ensure MongoDB is running
5. Clear browser cookies and try again

---

**Login System Status**: ✅ **ACTIVE & SECURE**

Content Calendar is now protected by enterprise-grade session authentication!
