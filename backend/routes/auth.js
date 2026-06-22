// ==================== Authentication Routes ====================

const express = require('express');
const router = express.Router();

const LOGIN_EMAIL = process.env.LOGIN_EMAIL;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate credentials
    if (email === LOGIN_EMAIL && password === LOGIN_PASSWORD) {
        // Set session
        req.session.userId = email;
        req.session.email = email;
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: email
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid email or password' 
        });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Logout failed' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    });
});

// GET /api/auth/check
router.get('/check', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ 
            authenticated: true, 
            user: req.session.email 
        });
    } else {
        res.json({ 
            authenticated: false 
        });
    }
});

module.exports = router;
