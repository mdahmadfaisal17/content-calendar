require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { connectDB } = require('./db/connection');
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Session middleware (MUST be before routes)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI,
        dbName: process.env.DB_NAME,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 // 24 hours
    }),
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ==================== ROUTES ====================

// LOGIN PAGE ROUTE (explicit - before catch-all)
app.get('/login', (req, res) => {
    console.log('[LOGIN ROUTE] User accessing /login');
    
    if (req.session && req.session.userId) {
        console.log('[LOGIN ROUTE] Already authenticated, redirecting to /');
        return res.redirect('/');
    }
    
    const loginPath = path.join(__dirname, '../public/login.html');
    console.log('[LOGIN ROUTE] Attempting to send:', loginPath);
    
    // Try to send file
    res.sendFile(loginPath, (err) => {
        if (err) {
            console.error('[LOGIN ROUTE ERROR] Failed to send file:', err.message);
            // Fallback: read and send manually
            try {
                const html = fs.readFileSync(loginPath, 'utf8');
                res.setHeader('Content-Type', 'text/html');
                res.send(html);
                console.log('[LOGIN ROUTE] Sent login page via fallback method');
            } catch (readErr) {
                console.error('[LOGIN ROUTE FATAL] Cannot read login.html:', readErr.message);
                res.status(500).json({ 
                    success: false, 
                    error: 'Cannot load login page',
                    path: loginPath
                });
            }
        } else {
            console.log('[LOGIN ROUTE] Successfully sent login.html');
        }
    });
});

// AUTH API ROUTES (no authentication required)
app.use('/api/auth', authRoutes);

// API ROUTES (authentication required)
app.use('/api', postsRoutes);

// DASHBOARD ROUTE (protected)
app.get('/', (req, res) => {
    if (req.session && req.session.userId) {
        return res.sendFile(path.join(__dirname, '../public/index.html'));
    }
    res.redirect('/login');
});

// CATCH-ALL: Redirect to login for any undefined routes
app.get('*', (req, res) => {
    // Don't redirect if it's an API or static file request
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'Not found' });
    }
    
    // For page requests, redirect to login if not authenticated
    if (req.session && req.session.userId) {
        return res.sendFile(path.join(__dirname, '../public/index.html'));
    }
    res.redirect('/login');
});

// ==================== SERVER STARTUP ====================

async function startServer() {
    try {
        await connectDB();
        
        const server = app.listen(PORT, () => {
            console.log(`\n${'═'.repeat(43)}`);
            console.log(`✓ Connected to MongoDB`);
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ Login page: http://localhost:${PORT}/login`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`${'═'.repeat(43)}`);
            console.log(`\n📍 ROUTES REGISTERED:`);
            console.log(`   GET  /login          → Login page`);
            console.log(`   POST /api/auth/login → Authenticate`);
            console.log(`   POST /api/auth/logout → Logout`);
            console.log(`   GET  /api/auth/check → Check session`);
            console.log(`   GET  /api/posts      → Get all posts (protected)`);
            console.log(`   POST /api/posts      → Create post (protected)`);
            console.log(`   PUT  /api/posts/:id  → Update post (protected)`);
            console.log(`   DEL  /api/posts/:id  → Delete post (protected)`);
            console.log(`   GET  /                → Dashboard (protected)`);
            console.log(`   GET  /*              → Catch-all (redirects to /login)\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
