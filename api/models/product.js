const mongoose = require('mongoose');

// A schema is like a layout, like a signoff 
const productSchema = mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },              //this describes what should be inside the db
    price: { type: Number, required: true },
    productImage: { type: String, required: true}              //this describes what should be inside the db
});

//The model is like the object itself
module.exports = mongoose.model('Product', productSchema);