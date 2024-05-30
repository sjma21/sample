

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingSchema = require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
// const Listing = require("../majorproject/models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js")

const Listing = require("../models/listing.js");
const { authorize } = require("passport");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'), wrapAsync(listingController.createListing));

// router.post("/", isLoggedIn,wrapAsync(async(req,res,next)=>{
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     console.log('Request Headers:', req.headers);
//     console.log('Request Body:', req.body);
//     await newListing.save();
//     console.log('Request Headers:', req.headers);
//   console.log('Request Body:', req.body);
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// }));


router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get('/search', wrapAsync(listingController.searchListings));


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

  


  
  //Edit Route:
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm ));
  
 // Search (new):
// Define the search route
// router.get('/search', wrapAsync(async (req, res) => {
//   const { location } = req.query;
//   try {
//       const results = await Listing.find({ location: new RegExp(location, 'i') });
//       res.render('listings/searchResults', { results, location });
//   } catch (error) {
//       console.error(error);
//       req.flash('error', 'Something went wrong. Please try again.');
//       res.redirect('/listings');
//   }
// }));




  module.exports = router;