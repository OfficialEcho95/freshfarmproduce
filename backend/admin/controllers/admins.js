const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const { generateToken } = require('../../middlewares/userAuthentication');


// Helper function to capitalize the first letter of each word in a string
function capitalizeEachWord(str) {
    return str
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join(' '); // Join the words back into a single string
}

// Helper function to capitalize the first letter of an email
function capitalizeEmail(email) {
    return email.charAt(0).toUpperCase() + email.slice(1);
}

// Function to  register new admins
const registerAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const emailExists = await Admin.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: `${email} already exists` });
        }
        // Ensure password is defined and non-empty
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name: capitalizeEachWord(name),
            email: capitalizeEmail(email),
            password: hashedPassword,
            role: role || 'admin'
        });
        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully", newAdmin });
    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: "Error registering admin" });
    }
};

// functions to log in admin
const loginAdmin = async (req, res) => {
    // try {
    //     const { email, password } = req.body;
    //     const user = await Admin.findOne({ email });

    //     if (!user) {
    //         return res.status(403).json({ message: "Please enter a correct email" });
    //     }

    //     const correctPassword = await bcrypt.compare(password, user.password);

    //     if (!correctPassword) {
    //         return res.status(403).json({ message: "Please enter a correct password" });
    //     }

    //     const token = generateToken(user._id);
    //     req.session.adminId = user._id;
    //     req.session.token = token;
    //     await req.session.save();

    //     const usernameByEmail = await Admin.findById(req.session.adminId);
    //     return res.status(201).json({ token, message: `${usernameByEmail.name} is logged in as an admin`, user });
    // } catch (error) {
    //     console.error("Error logging in admin:", error);
    //     return res.status(500).json({ message: "Internal server error" });
    // }
};


// function to logout admin
const logoutAdmin = async (req, res) => {
    if (req.session.adminId) {
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

module.exports = { registerAdmin, loginAdmin, logoutAdmin }