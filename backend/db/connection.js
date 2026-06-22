const { MongoClient } = require('mongodb');

let db = null;

async function connectDB() {
    if (db) {
        return db;
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
        await client.connect();
        console.log('✓ Connected to MongoDB');
        
        db = client.db(process.env.DB_NAME || 'content_calendar');
        
        // Ensure collection exists
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === (process.env.COLLECTION_NAME || 'posts'));
        
        if (!collectionExists) {
            await db.createCollection(process.env.COLLECTION_NAME || 'posts');
            console.log('✓ Created posts collection');
        }
        
        return db;
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
}

module.exports = {
    connectDB,
    getDB
};
