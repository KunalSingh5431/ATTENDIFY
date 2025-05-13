const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const {authToken} = require('../middlewares/token-middleware');


router.route('/').get(authController.home);

router.route('/register').post(authController.register);

router.route('/login').post(authController.login);

router.route('/profile').get(authToken,authController.getProfile);

router.route('/profile-image').put(authToken, authController.updateProfileImage);

module.exports = router;