const mongoose = require('mongoose');   
const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;
//register function to register a user
const register = async (req, res) => {
res.send('Welcome to the Users Register Api');
}
//Login function to login the user 
const login = async (req, res) => {
    //get the email and password from the request body
    const {email, password} = req.body;
    //check if the user exists
    const user = await User.find({email});
    if (user.length === 0) {
        return res.status(400).json({
            message: 'User does not exist'
        });
    }else{
        //compare the password
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'Invalid password'
            });
        }else{
            res.cookie('token', generateToken(user[0]), {
                expires: new Date(Date.now() + 86400000), // 1 day
                httpOnly: true
            });

            res.status(200).json({
                message: 'Login successful',
                data: {
                    name: user[0].name,
                    email: user[0].email,
                    token: generateToken(user[0])
                }
            });
        }
    }
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