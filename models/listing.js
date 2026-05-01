const { ref } = require('joi')
const mongoose = require('mongoose')
const schema = mongoose.Schema
const Review = require('./reviews.js')
const User = require('./user.js')

const listingSchema = new schema({
    title: {
        type : String,
        required : true
    },
    description: String,
    image: {
        url : String,
        filename : String,
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : schema.Types.ObjectId,
            ref : "Review"
        },
    ],
    owner : {
        type : schema.Types.ObjectId,
        ref : "User"
    },
    categories : [{
        type : String,
        enum : ["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping","Farms","Arctic","Domes","Boats","Others"]
    }]
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        Review.deleteMany(_id , {$in : listing.reviews})
    }
})


listingSchema.index({
  title: "text",
  location: "text",
  country: "text",
  description: "text",
  categories: "text"
})
const Listings = mongoose.model("Listings", listingSchema)
module.exports = Listings





