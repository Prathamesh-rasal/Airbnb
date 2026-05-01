if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}



const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path') // ejs sathi
const methodOverride = require('method-override') // convert post to put and delete
const ejsMate = require('ejs-mate')
const Listing = require("./models/listing.js")
const ExpressError = require('./utils/ExpressErrors.js')
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const session = require('express-session')
const MongoStore = require('connect-mongo').default;;
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const userRouter = require('./routes/user.js')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })




app.set('view engine','ejs') // ejs sathi
app.set('views',path.join(__dirname,'views')) // ejs sathi
app.use(express.urlencoded({extended : true})) // link varchi id milnya sathi
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,'/public')))

const dbUrl = process.env.ATLASDB_URL
// dbUrl = "mongodb://127.0.0.1:27017/wanderlust"

main().then((res) =>{console.log('connect to database')})
.catch((err)=>{console.log(err)})

async function main(){
    await mongoose.connect(dbUrl);
}

const store = new MongoStore({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600
})

store.on("error",(err)=>{
    console.log("error in mongo session store",err)
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        HttpOnly : true
    },
}



app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get('/testListing',async(req,res)=>{
//     let sampleListing = new Listing({
//         title : "home",
//         description : "this is a sample listing",
//         price : 100,
//         location : "mumbai",
//         country : "india"
//     })
//     await sampleListing.save()
//     console.log("sample was saved")
//     res.send('sucessfully saved sample listing')
// })


app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user
    next()
})



app.get('/listings/search',async(req,res)=>{
    const {query} = req.query
    if (!query || query.trim() === "") {
        return res.redirect("/listings");
    }
    let textResults = await Listing.find({$text: { $search: query }});
    let categoryResults = await Listing.find({ categories: query });
    let combined = [...textResults, ...categoryResults];

    let listings = Array.from(
        new Map(combined.map(item => [item._id.toString(), item])).values()
    );

    if (listings.length === 0) {
        req.flash('error', 'No listings found');
        return res.redirect('/listings');
    }
    res.render("listings/index.ejs", { allListings: listings });
})

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)





app.use((req,res,next)=>{
    next( new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err
    res.status(statusCode).render('listings/error.ejs',{message})
})

app.listen(8080,()=>{
    console.log("Server start")
})

