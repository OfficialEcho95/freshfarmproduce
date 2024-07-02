const jwt = require('jsonwebtoken');
const User = require('../admin/models/admin');
const UserFarmer = require('../users/models/user')

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.AUTH_KEY, { expiresIn: "5H" });
};


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.session.token || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - missing token' });
    }

    try {
        const user = jwt.verify(token, process.env.AUTH_KEY);

        if (req.session.userId !== user.userId) {
            return res.status(401).json({ error: 'Unauthorized - invalid user' });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized - token expired' });
        } else {
            return res.status(401).json({ error: 'Unauthorized - invalid token' });
        }
    }
};


//middleware for admin access
const adminAccess = (req, res, next) => {
    if (req.user && req.user.role !== 'admin') {
        res.send({ message: "Access forbidden"});
    }
    return next()
}


/* middleware to give admin or only  farmer access to view his 
completed orders
*/
const authorizeFarmerOrAdmin = async (req, res, next) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const dbUser = await UserFarmer.findById(user.userId);
        if (!dbUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (dbUser.role === 'admin' || dbUser._id.toString() === id) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied.' });
        }
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { authenticateToken, generateToken, adminAccess, authorizeFarmerOrAdmin }
