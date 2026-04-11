const express = require('express');
const router = express.Router({mergeParams : true})
const {listingSchema , reviewSchema} = require('../schema.js')
const Reviews = require("../models/reviews.js")
const Listing = require("../models/listing.js") 
const wrapAsync = require('../utils/wrapAsync.js')
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')
const reviewController = require('../controllers/reviews.js')


// Reviews
// post route for reviews
router.post("/",isLoggedIn ,validateReview, wrapAsync(reviewController.createReview))

// Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))


module.exports = router
