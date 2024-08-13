const Post = require('../models/post');

const getPostsTimeBasedRotation = async () => {
    try {
        const rotationInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const currentTime = new Date();
        const allPosts = await Post.find().populate('commodity').populate('commodity.farmer').exec();

        const result = [];
        const eligiblePosts = allPosts.filter(post => {
            const lastDisplayedAt = new Date(post.lastDisplayedAt || 0); // Default to epoch(algorithm) if not set
            const timeDifference = currentTime - lastDisplayedAt.getTime();

            // Include posts that have never been displayed (lastDisplayedAt is epoch) or have surpassed the interval
            return lastDisplayedAt.getTime() === 0 || timeDifference >= rotationInterval;
        });

        // If no posts are eligible, fall back to returning the most recently displayed posts
        if (eligiblePosts.length === 0) {
            console.log("No eligible posts found. Returning posts sorted by last displayed time.");
            allPosts.sort((a, b) => new Date(a.lastDisplayedAt || 0) - new Date(b.lastDisplayedAt || 0));
            return allPosts.slice(0, 20);
        }

        // Display eligible posts
        eligiblePosts.forEach(post => {
            result.push(post);
            post.lastDisplayedAt = currentTime;
            post.save();
        });

        return result;
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

// API endpoint to get posts using time-based rotation
const getPosts = async (req, res) => {
    try {
        const posts = await getPostsTimeBasedRotation();
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching posts' });
    }
};

module.exports = { getPosts };
