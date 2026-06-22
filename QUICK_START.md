# 🚀 QUICK START GUIDE

Complete your full-stack Content Calendar setup in 5 minutes!

## ✓ What's Already Done

- [x] Backend Express server configured
- [x] MongoDB connection setup
- [x] API endpoints (GET, POST, PUT, DELETE)
- [x] Frontend completely refactored to use API (no localStorage)
- [x] All files in correct directories
- [x] .env file created with configuration
- [x] Complete documentation

## 📋 Setup Checklist

### 1. Prerequisites Check

```bash
# Check Node.js is installed
node --version
# Should output v14.0.0 or higher

# Check npm is installed
npm --version
# Should output 6.0.0 or higher
```

### 2. Install Dependencies (1 minute)

```bash
cd "d:\0 Abdullah Al Faysal\content-calendar"
npm install
```

**What this does:**
- Installs Express, MongoDB driver, and other dependencies
- Creates `node_modules` folder
- Ready to go!

### 3. MongoDB Setup (2 minutes)

**Option A: Using Local MongoDB**

Windows:
```bash
# If MongoDB is installed, ensure service is running
# Services → MongoDB Server → Start
# Or run from command line:
mongod
```

macOS (with Homebrew):
```bash
brew services start mongodb-community
```

**Option B: Using MongoDB Atlas (Cloud - No Install Needed!)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://...`
5. Edit `.env` file, replace:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.xxxxx.mongodb.net/
   ```

### 4. Start the Application (30 seconds)

```bash
npm run dev
```

**Expected Output:**
```
═══════════════════════════════════════
✓ Connected to MongoDB
✓ Created posts collection
✓ Server running on http://localhost:5000
✓ Environment: development
═══════════════════════════════════════
```

### 5. Open in Browser

Navigate to: **http://localhost:5000**

That's it! 🎉

---

## 💡 What's Working Now

✅ Click any date to see posts for that day
✅ Click upcoming items to edit status
✅ All changes saved to MongoDB automatically
✅ Status persists across page refreshes
✅ Full calendar for June & July 2026
✅ Upcoming content dashboard
✅ Color-coded topics

---

## 📍 Project Location

```
d:\0 Abdullah Al Faysal\content-calendar\
├── .env ← Your configuration (edit if needed)
├── package.json ← Dependencies list
├── README.md ← Full documentation
├── backend/
│   ├── server.js ← Main server
│   ├── routes/posts.js ← API endpoints
│   └── db/connection.js ← MongoDB connection
└── public/
    ├── index.html ← UI structure
    ├── script.js ← Frontend logic (uses API)
    └── styles.css ← Styling
```

---

## 🛑 If Something Doesn't Work

### "npm not found" error
- Reinstall Node.js from https://nodejs.org
- Restart terminal after installation

### "Cannot connect to MongoDB"
- Ensure MongoDB service is running
- Check `.env` file has correct MONGODB_URI
- For Atlas, whitelist your IP in network settings

### "Port 5000 already in use"
- Edit `.env`: change `PORT=5000` to `PORT=3000`
- Run `npm run dev` again

### "No posts loaded on page"
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Terminal for backend errors

---

## 🎯 Next Steps

1. **Customize data** by editing calendar dates in `public/script.js`
2. **Deploy** using Vercel, Heroku, or your preferred platform
3. **Add features** like filtering, exporting, or team collaboration
4. **Switch database** to MongoDB Atlas for production

---

## 📞 Support

For detailed information, see [README.md](README.md)

Happy scheduling! 📅
