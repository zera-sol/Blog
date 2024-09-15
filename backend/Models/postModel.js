const mongoose = require("mongoose");
const userModel = require("./userModel");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    fullText: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
}, { timestamps: true });

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;