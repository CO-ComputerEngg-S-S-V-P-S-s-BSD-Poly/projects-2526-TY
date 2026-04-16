const datastock = require("./StockModel");

/* ADD STOCK */

exports.addStock = async(req,res)=>{

try{

const stock = new datastock(req.body);

await stock.save();

res.json(stock);

}

catch(err){

res.status(500).json(err);

}

};


/* GET STOCK */

exports.getStock = async(req,res)=>{

try{

const data = await datastock.find();

res.json(data);

}

catch(err){

res.status(500).json(err);

}

};


/* REDUCE STOCK WHEN DELIVERY COMPLETE */

exports.reduceStock = async(req,res)=>{

try{

const stock = await datastock.findOne()

if(!stock){
return res.status(404).json("Stock not found")
}

if(stock.qty <= 0){
return res.json({message:"No cylinder available"})
}

stock.qty = stock.qty - 1

stock.empty = (stock.empty || 0) + 1

await stock.save()

res.json(stock)

}

catch(err){
res.status(500).json(err)
}

};