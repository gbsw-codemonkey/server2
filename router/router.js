const express = require('express');
const router = express.Router();
//controller path
const authController = require('../controller/authController')
const userController = require('../controller/userController')
const videoController = require('../controller/videoController')

router.get('/home', authController.home);

// auth: signup routes
router.post('/auth/signup', authController.signup);

// auth: login routes
router.post('/auth/login', authController.login);

// auth: login verify routes
router.get('/auth/verify', authController.verify)

// user: get me routes
router.get('/user/@me', userController.getMe)

// user: get user by idx routes
router.get('/user/:user_idx', userController.getUserById)

// video: create new video routes
router.post('/video', videoController.createVideo)

// video: get videos by idx routes
router.get('/video', videoController.getVideosByUser)

// video: get video by video_id routes
router.get('/video/id/:video_id', videoController.getVideoById)

// video: get all video routes
router.get('/video/all', videoController.getAllVideos)

// video: increase like_count routes
router.get('/video/like/:video_id', videoController.incrementLikeCount)

// video: decrease like_count routes
router.delete('/video/like/:video_id', videoController.decrementLikeCount)

// like: liked videos by user_idx routes
router.get('/like', userController.getLikesByUser)

module.exports = router;