const express = require('express');
const router = express.Router({mergeParams : true})
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync.js')
const passport = require('passport')
const { saveRedirectUrl } = require('../middleware.js')
const userContriller = require('../controllers/users.js');


router
    .route('/signup')
    .get(userContriller.renderSignup)  // render signup form
    .post(wrapAsync(userContriller.signup))

router
    .route('/login')
    .get(userContriller.renderLogin)
    .post(saveRedirectUrl,passport.authenticate('local',{ failureRedirect: '/login' , failureFlash : true}),userContriller.login)


router.get('/logout',userContriller.logout)


module.exports = router
