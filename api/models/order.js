const mongoose = require('mongoose');

// A schema is like a layout, like a signoff 
const orderSchema = mongoose.Schema({
     //this describes what should be inside the db
    _id:  mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, required: true,
        ref: 'Product' }, //this is referencing product.js in models             
    quantity: { type: Number, default: 1 }             
});

//The model is like the object itself
module.exports = mongoose.model('Order', orderSchema);