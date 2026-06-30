const express = require('express');
const router = express.Router();
const { getDB } = require('../db/connection');
const { ObjectId } = require('mongodb');
const { isAuthenticated } = require('../middleware/auth');

// Get all posts
router.get('/posts', isAuthenticated, async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection(process.env.COLLECTION_NAME || 'posts');
        const posts = await collection.find({}).toArray();
        res.json({ success: true, data: posts });
    } catch (error) {
        console.error('GET /posts error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new post
router.post('/posts', isAuthenticated, async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection(process.env.COLLECTION_NAME || 'posts');
        
        const post = {
            platform: req.body.platform,
            date: req.body.date,
            topic: req.body.topic,
            status: req.body.status || 'pending',
            color: req.body.color || null,
            note: req.body.note || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await collection.insertOne(post);
        res.status(201).json({ success: true, data: { _id: result.insertedId, ...post } });
    } catch (error) {
        console.error('POST /posts error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update post status
router.put('/posts/:id', isAuthenticated, async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection(process.env.COLLECTION_NAME || 'posts');
        
        const updateData = {
            updatedAt: new Date()
        };
        
        // Allow updating status, topic, and color
        if (req.body.status) updateData.status = req.body.status;
        if (req.body.topic) updateData.topic = req.body.topic;
        if (req.body.color !== undefined) updateData.color = req.body.color;
        if (req.body.note !== undefined) updateData.note = req.body.note;
        
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        
        res.json({ success: true, message: 'Post updated successfully' });
    } catch (error) {
        console.error('PUT /posts/:id error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a post
router.delete('/posts/:id', isAuthenticated, async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection(process.env.COLLECTION_NAME || 'posts');
        
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('DELETE /posts/:id error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
