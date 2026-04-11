const Reviews = require("../models/reviews.js")
const Listing = require("../models/listing.js") 

module.exports.createReview = async(req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    let newReview = new Reviews(req.body.review)
    newReview.author = req.user._id
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    console.log("new review was added")
    req.flash('success','New review created')
    res.redirect(`/listings/${id}`)
}


module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}})
    await Reviews.findByIdAndDelete(reviewId)
    req.flash('success','Review deleted')
    res.redirect(`/listings/${id}`)
}