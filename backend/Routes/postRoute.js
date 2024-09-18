const express = require("express");
const multer = require("multer");
const uploadMiddleware = multer({ storage: multer.memoryStorage() }); // Use memory storage
const router = express.Router();
const postController = require("../Controllers/postController");


router.post('/create-post', uploadMiddleware.single('image'), postController.createPost);
router.put('/edit-post', uploadMiddleware.single('image'), postController.editPost);
router.get('/', postController.displayPosts);
router.get('/:id', postController.displayPost);
router.delete('/delete-post/:id', postController.deletePost);

module.exports = router;
