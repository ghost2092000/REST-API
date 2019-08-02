const mongoose = require('mongoose');

// A schema is like a layout, like a signoff 
const userSchema = mongoose.Schema({
    //this describes what should be inside the db
   _id:  mongoose.Schema.Types.ObjectId,
   email: {
       type: String, 
       required: true, 
       unique: true, 
       match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
   password:{type:String, required: true}
              
});

//The model is like the object itself
module.exports = mongoose.model('User', userSchema);