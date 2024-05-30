const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// const imageSchema = new Schema({
//     filename: String,
//     url: String
// });

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: String,
//     image: {
//         type: imageSchema,
//         default: {
//             filename: "https://images.unsplash.com/photo-1714572877777-59bf4765f462?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             url: "https://images.unsplash.com/photo-1714572877777-59bf4765f462?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//         }
//     },
//     price: Number,
//     location: String,
//     country: String,
// });

// const Listing = mongoose.model('Listing', listingSchema);

// module.exports = Listing;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
       url : String,
       filename : String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
},
],
owner : {
    type: Schema.Types.ObjectId,
    ref : "User",
},

});
listingSchema.post("findoneAndDelete" , async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;