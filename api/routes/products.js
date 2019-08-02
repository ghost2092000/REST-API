const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

const multer = require('multer');

const checkAuth = require('../middleware/check-auth');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    //reject a file 
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
};



const upload = multer({
    storage: storage,
    limits:{ 
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter, 
});

//////////////////    /products   ////////////////////////


//get all the products that we have
router.get('/', (req, res, next) => { 
      Product.find() 
      .select('name price _id productImage') // use this so we don't get useless info back
      .exec()
      .then(docs =>{
          const response ={
              count: docs.length,  //use this to return how many data entries we have
            //   products: docs // use this also so we don't get useless info back
              products: docs.map(doc =>{
                  //I will get a name, price, id , the type of request that was made, and the url
                  return{
                      name: doc.name,
                      price: doc.price,
                      _id: doc._id,
                      productImage: doc.productImage,
                        request:{
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }

                  }
              })
          };
          res.status(200).json(response);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
                error:err
          });
      });
}); 
 


router.post('/',  upload.single('productImage'),checkAuth, (req, res, next) => { 
    console.log(req.file);
    //This is where i can store the data to the db!, this extracts the info we write in insomia 
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    //save is in charge of actually storing things inside the db
    product
        .save()
        .then(result  => {
            console.log(result);
        res.status(201).json({

            //{ This has to do with the Mongoose Validation 
            message: 'Created Product successfully', 
            // createdProduct: product // this is where product object goes to
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                  request:{
                      type: "GET",
                      url: "http://localhost:3000/products/" + result._id
                  }
                }
            //}
         });
        })
        .catch(err => {
            console.log(err);  
            res.status(500).json({
                error: err
            });
        });
}); 



//////////////////    /products/{id}    ////////////////////////

//get data from the id
router.get('/:productId', (req, res, next) => { 
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log('From Database',doc);
        if(doc){
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({message: 'Not a valid entry for ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
}); 

router.patch('/:productId', (req, res, next) => { 
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {  
            console.log(result);     
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                 error:err
            })
        });
});

router.delete('/:productId', (req, res, next) => { 
   const id = req.params.productId;
   Product.remove({_id: id})
        .exec() 
        .then(result => {       
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                 error:err
            })
        });
});

module.exports = router;