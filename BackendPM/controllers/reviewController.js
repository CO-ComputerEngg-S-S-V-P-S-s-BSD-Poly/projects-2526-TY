const Review = require("../models/Review")

const createReview = async (req,res) => {

try{

const {userId,panditId,bookingId,rating,comment} = req.body

const existingReview = await Review.findOne({
user:userId,
booking:bookingId
})

if(existingReview){
return res.status(400).json({message:"Review already given"})
}

const review = await Review.create({
user:userId,
pandit:panditId,
booking:bookingId,
rating,
comment
})

res.json({message:"Review Added",review})

}catch(err){
console.log(err)
res.status(500).json({message:"Error"})
}

}

module.exports = {createReview}