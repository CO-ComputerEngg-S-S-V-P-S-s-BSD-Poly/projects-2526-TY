const mongoose = require("mongoose");

const datastockSchema = new mongoose.Schema({

date:{
type:String
},

company:{
type:String,
required:true
},

type:{
type:String,
required:true
},

qty:{
type:Number,
required:true
},

empty:{
type:Number,
default:0
}

});

module.exports = mongoose.model("datastock",datastockSchema);