const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const ExpressError= require("../utils/ExpressError.js");

module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({});
     res.render("listings/index.ejs" , {allListings});
   
};

module.exports.renderNewForm = (req,res)=>{
    return res.render("listings/new.ejs");
}
  

module.exports.showListing = async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path : "reviews", 
      populate: {
        path:"author",
      },
      })
    .populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested for does not exists!");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
  };




  module.exports.createListing = async(req,res,next)=>{
      let url =  req.file.path;
      let filename = req.file.filename;
      let newListing =  new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url, filename};
      await newListing.save();
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
  };


  module.exports.renderEditForm = async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
     req.flash("error", "Listing you requested for does not exists!");
     res.redirect("/listings");
   }
    let originalImageurl = listing.image.url;
    originalImageurl =   originalImageurl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs" , { listing, originalImageurl});
};
module.exports.updateListing = async ( req, res)=>{
  
    let { id } = req.params;     
   let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});

   if(typeof req.file != "undefined"){
    let url =  req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
   }


  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`); 
};
module.exports.destroyListing = async(req,res)=>{
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
  //  console.log(deletedListing);
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
}

// module.exports.searchListings = async (req, res) => {
//   const { location } = req.query;
//   try {
//       // Using a case-insensitive regex to search by location
//       const results = await Listing.find({ location: new RegExp(location, 'i') });
//       res.render('listings/searchResults', { results, location });
//   } catch (error) {
//       console.error(error);
//       req.flash('error', 'Something went wrong. Please try again.');
//       res.redirect('/listings');
//   }
// };


module.exports.searchListings = async (req, res) => {
    const { location } = req.query;

    if (!location) {
        req.flash('error', 'Please provide a location to search.');
        return res.redirect('/listings');
    }

    try {
        // Using a case-insensitive regex to search by location
        const results = await Listing.find({ location: new RegExp(location, 'i') });

        if (results.length === 0) {
            req.flash('error', `No listings found for "${location}"`);
            return res.redirect('/listings');
        }

        res.render('listings/searchResults', { results, location });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/listings');
    }
};
