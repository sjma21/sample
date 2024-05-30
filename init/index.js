const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("Connected to Db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

  const initializedb = async ()=>{
   await  Listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({...obj, owner :"664ccc4ca69b30daefa7ae0a"}));
   await Listing.insertMany(initdata.data);
   console.log("Data was initialize ");
  }
  initializedb();