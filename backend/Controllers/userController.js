const mongoose = require('mongoose');   
const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;
//register function to register a user
const register = async (req, res) => {
const formData = req.body;
const { email } = formData;
//now we will try to save the user to the database
 try {
        //we need to check whether the user already exists
        const Users = await User.find({ email});

        if (Users.length > 0) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        else{
            //let's hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(formData.password, salt);
            //let's create a us
            //if the user does not exist, we will save the user to the database
                const newUser = new User({
                    name: formData.fullName,
                    email: formData.email,
                    password: hashedPassword,
                });
                await newUser.save();
                res.status(201).json({
                    message: 'User registered successfully',
                    data: newUser
                });
            }
    } catch (error) {
            res.status(500).json({
                message: 'An error occurred',
                error: error.message
            });
    }
}
//Login function to login the user 
const login = async (req, res) => {
   res.send("Login route");
}

//profile function to get the user profile
const profile = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(200).json({
            message: 'User profile',
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error: error.message
        });
    }
}

const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message: 'Logout successful'
    });
}

//Generate token function
const generateToken = (user) => {
    return jwt.sign({id: user._id, email: user.email}, SECRET_KEY);
}

//export the necessary functions to be used in the routes
module.exports = {
    register,
    login,
    profile,
    logout,
}