const Admin = require('../models/admin');
const User = require('../../users/models/user');
const bcrypt = require('bcrypt');
const Post = require('../../users/models/post');
const getAdminNameFromSession = require('../../middlewares/adminsession');


// Function to let admin create new user
const adminCreateUser = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({email});
    if (user) {
        res.status(404).json({ message: `${email} exists`})
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        name,
        password: hashedPassword,
        email, 
        role: 'buyer'
    });

    await newUser.save();
    const requestBy = (req.session.adminId).toString();
    const usernameByEmail = await Admin.findById( requestBy );
    res.status(201).json({ message: `${name} was created by administrator ${usernameByEmail.name}`});
}

//function to let admin update user
const adminUpdateUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: `User with email ${email} not found.` });
        }
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if (key === 'password') {
                    const hashedPassword = await bcrypt.hash(req.body[key], 10);
                    user.password = hashedPassword;
                } else {
                    // Update other fields directly
                        user[key] = req.body[key];                 
                }
            }
        }

        await user.save();
        const requestBy = (req.session.adminId).toString();
        const usernameByEmail = await Admin.findById( requestBy );

        res.status(200).json({ message: `${user.name} updated by ${usernameByEmail.name}` });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'An error occurred while updating the user.' });
    }
};

//function for admin to view user details
const adminViewUserDetails = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ message: 'Either email is required to view user details.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: `User not found with ${email} email` });
        }

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving user details.' });

    }
};

//function for admin to delete user account
const adminDeleteUser = async (req, res) => {
    const {email} = req.body;
    if (!email) {
        res.status(404).json({message: "Enter a correct email"});
    }
    const checkemail = await User.findOneAndDelete(email);
    const adminId = req.session.adminId;
    const admin = await Admin.findById(adminId);
    res.status(203).json({message: `${checkemail.name}, has been deleted permanently by ", ${admin.name}`});
}

//Moderate User Content: Admins can reject user-generated content.
const adminDeleteUserPost = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required.' });
        }
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: `Post with ID ${postId} not found.` });
        }

        // Retrieve the admin name from the session
        const adminName = await getAdminNameFromSession(req);

        res.status(200).json({ message: `${adminName} deleted post with ID ${postId}` });

    } catch (error) {
        // Log the error and return an error response
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'An error occurred while deleting the post.' });
    }
};

module.exports = { adminCreateUser, adminUpdateUser, adminViewUserDetails, adminDeleteUser,
            adminDeleteUserPost}