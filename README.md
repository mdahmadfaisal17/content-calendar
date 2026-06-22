# Content Calendar - Full-Stack Application

A modern content calendar application built with Node.js, Express, and MongoDB. Track your social media posting schedule across multiple platforms with real-time status updates.

## 📋 Features

- ✅ Multi-platform scheduling (Dribbble, LinkedIn, Hue FB, FA FB)
- ✅ Real-time status tracking (Pending → Working → Done)
- ✅ MongoDB persistence - all data saved to database
- ✅ RESTful API endpoints
- ✅ Responsive design
- ✅ Unique colors for each content topic
- ✅ Upcoming content dashboard
- ✅ Color-coded content categories

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: Vanilla JavaScript (HTML5 + CSS3)
- **API**: RESTful Architecture

## 📁 Project Structure

```
content-calendar/
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── backend/
│   ├── routes/
│   │   └── posts.js (API routes)
│   ├── db/
│   │   └── connection.js (MongoDB connection)
│   └── server.js (Express server)
├── package.json
├── .env (environment variables)
├── .env.example (template)
├── .gitignore
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (installed locally or MongoDB Atlas connection)
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `mongodb` - MongoDB driver
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `nodemon` - Auto-restart during development

### Step 2: Create .env File

Create a `.env` file in the project root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Name
DB_NAME=content_calendar
COLLECTION_NAME=posts
```

### Step 3: Ensure MongoDB is Running

**Option A: Local MongoDB**
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Windows (installed service)
# MongoDB service should auto-start

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
Replace `MONGODB_URI` in `.env` with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
```

### Step 4: Run the Application

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The application will:
- Connect to MongoDB
- Create database `content_calendar` (if not exists)
- Create collection `posts` (if not exists)
- Start Express server on http://localhost:5000

Expected output:
```
═══════════════════════════════════════
✓ Connected to MongoDB
✓ Created posts collection
✓ Server running on http://localhost:5000
✓ Environment: development
═══════════════════════════════════════
```

## 🔌 API Endpoints

### Get All Posts
```http
GET /api/posts
```
Returns all posts with their status from MongoDB

### Create New Post
```http
POST /api/posts
Content-Type: application/json

{
  "platform": "dribbble",
  "date": "2026-06-29",
  "topic": "Full Brand Identity",
  "status": "pending"
}
```

### Update Post Status
```http
PUT /api/posts/:id
Content-Type: application/json

{
  "status": "working"
}
```

### Delete Post
```http
DELETE /api/posts/:id
```

## 📝 .env File Guide

Location: `d:\0 Abdullah Al Faysal\content-calendar\.env`

### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_NAME` | Database name | `content_calendar` |
| `COLLECTION_NAME` | Collection name | `posts` |

### Connection String Examples:

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.abcd1234.mongodb.net/
```

**MongoDB with Authentication:**
```env
MONGODB_URI=mongodb://user:password@localhost:27017
```

## 💾 Database Schema

### Posts Collection

```javascript
{
  _id: ObjectId,
  platform: "dribbble",           // Platform name
  date: "2026-06-29",             // YYYY-MM-DD format
  topic: "Full Brand Identity",   // Topic/content name
  status: "pending",              // pending | working | done
  createdAt: ISODate,             // Auto-created
  updatedAt: ISODate              // Auto-updated
}
```

## 🔄 How It Works

1. **Frontend** loads and calls `GET /api/posts`
2. **Backend** fetches all post statuses from MongoDB
3. Frontend displays calendar with loaded statuses
4. User clicks calendar/upcoming item → Opens modal
5. User selects new status → Clicks OK
6. **Frontend** calls `POST /api/posts` (new) or `PUT /api/posts/:id` (existing)
7. **Backend** saves to MongoDB
8. **Frontend** refreshes display with new status

## 🌐 Accessing the Application

Once running, open your browser:
```
http://localhost:5000
```

## ⚙️ Environment Variables Explained

### MONGODB_URI
The connection string to your MongoDB instance. This is the "gateway" to your database.
- Local: Points to your computer's MongoDB
- Atlas: Points to MongoDB cloud service

### PORT
Which port the Express server listens on. Change if 5000 is in use:
```bash
PORT=3000  # Use port 3000 instead
```

### NODE_ENV
Tells the app which environment it's running in:
- `development`: Shows debug info, auto-reload
- `production`: Optimized, no debug logs

### DB_NAME & COLLECTION_NAME
Names for your MongoDB database and collection. These are created automatically.

## 🐛 Troubleshooting

### "MongoDB connection error"
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB service is running
- For Atlas, verify connection string and IP whitelist

### "Port 5000 is already in use"
```bash
# Change PORT in .env
PORT=5001
npm run dev
```

### "Cannot find module 'express'"
```bash
npm install
```

### "No posts scheduled" on refresh
- Ensure MongoDB is running and connected
- Check browser console for errors (F12)
- Verify database has been created

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT

## 👨‍💻 Author

Abdullah Al Faysal

---

**Need help?** Check the console logs in both terminal (backend) and browser (frontend) for detailed error messages.
