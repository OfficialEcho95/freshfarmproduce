const { generateToken } = require('../../middlewares/userAuthentication');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Admin = require('../../admin/models/admin');

// Helper function to capitalize the first letter of an email
function capitalizeEmail(email) {
    return email.charAt(0).toUpperCase() + email.slice(1);
}

// Helper function to capitalize the first letter of each word in a string
function capitalizeEachWord(str) {
    return str
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join(' '); // Join the words back into a single string
}

// Function to register new users
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: `${email} already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: capitalizeEachWord(name),
            email: capitalizeEmail(email),
            password: hashedPassword,
            role
        });

        await newUser.save();

        if (newUser.role === 'admin') {
            const newAdmin = new Admin({
                name,
                password,
                role,
                email
            });
            await newAdmin.save();
        }
        return res.status(201).json({ message: "User registered successfully", newUser });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email does not exist" });
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(402).json({ message: "Incorrect password" });
        }
        const token = generateToken(user._id);
        req.session.userId = (user._id).toString();
        req.session.token = token;

        await req.session.save();
        return res.status(200).json({ message: `${user.name} logged in successfully`, id: `${user._id}`, user, token });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error encountered logging in" });
    }
}


//function to update user data
const updateUserData = async (req, res) => {
    try {
        console.log("Now starting profile update");
        const { data, password } = req.body;
        const userId = req.session.userId;
        
        if (!data && !password) {
            return res.status(400).json({ message: "No data provided" });
        }

        const update = {};

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            update.password = hashedPassword;
        }

        // `data` is an object with other user fields to update
        Object.assign(update, data);

        const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User data updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//route to delete user account
const deleteUserAccount = async (req, res) => {
    try {
        const { email } = req.params;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not logged in" });
        }

        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ message: "User with that email does not exist" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting account", error: err.message });
    }
};

//function to update user dspa// function to logout user
const logoutUser = async (req, res) => {
    if (req.session.userId) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error logging out.' });
            }
            res.status(200).json({ message: 'Logged out successfully.' });
        });
    } else {
        res.status(400).json({ message: 'No active session to log out.' });
    }
};


const checkSession = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ valid: false, message: 'Invalid session' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ valid: false, message: 'User not found' });
        }

        // Optionally, you can include more user details if needed
        res.status(200).json({ valid: true, userId: user._id, role: user.role });
    } catch (error) {
        console.error('Error checking session:', error);
        res.status(500).json({ valid: false, message: 'Internal server error' });
    }
}


module.exports = { registerUser, loginUser, checkSession, logoutUser, updateUserData, deleteUserAccount }