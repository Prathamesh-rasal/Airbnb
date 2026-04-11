const Listing = require('./models/listing.js')
const Reviews = require("./models/reviews.js")
const ExpressError = require('./utils/ExpressErrors.js')
const {listingSchema , reviewSchema } = require('./schema.js')


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash('error','You must be logged in to create a listing')
        return res.redirect('/login')
    }
    next()
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
        delete req.session.redirectUrl;
    }
    next()
}


module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error','You do not have permission to edit')
        return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if (error){
        console.log(error)
        throw new ExpressError(400,result.error)
    } else{
        next()
    }

}


module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if (error){
        throw new ExpressError(400,error)
    } else{
        next()
    }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Reviews.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error','You do not have permission to delete')
        return res.redirect(`/listings/${id}`)
    }
    next()
}