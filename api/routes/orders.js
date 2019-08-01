const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Order = require('../models/order');

const Product = require('../models/product');


//////////////////    /orders    ////////////////////////

//to display all the orders
router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id') // this is what will be displayed
        
        .populate(
            'product',
            'price',
            // 'name'
            ) //we use this part as a key for merging 
        
        .exec()
        .then(tron => {
            res.status(200).json({
                count: tron.length,
                orders: tron.map(tron =>{
                    return {
                        _id: tron._id,
                        product: tron.product,
                        quantity: tron.quantity,
                            request:{
                                type: 'Get',
                                url: 'http://localhost:3000/orders/' + tron._id
                            }
                    }
                })
            });
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
});

//when using it i have to use an id from product
router.post('/', (req, res, next) => {
    
    Product.findById(req.body.productId) // this will check if the id we typed is valid
    .then( product => {
        if(!product){
            return res.status(404).json({
                message: "Product not found!!"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
           return order.save();
    })
            .then(result => {
                console.log(result);
                //this is what will be shown 
                res.status(201).json({
                    message: 'Order stored',
                    createdOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                });
            })
    
            .catch(err => {
                res.status(500).json({
                    message: 'Product not found',
                    error: err
                });
            });
});



//////////////////    /orders/{id}    ////////////////////////

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
        //{   Check if id contains any data, if null then it returns an 404 error 
        if(!order){
                return res.status(404).json({
                    message: "Order not found!!!"
                }); 
        }
        //}

        res.status(200).json({
            order: order, 
            request:{
                type: 'Get', 
                url: 'http://localhost:3000/orders'
            }
        });
    })
    .catch(err => { 
        res.status(500).json({
                error: err
        });
    });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted ', 
            request:{
                type: 'Get',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: "ID",
                    quantity: "Number"
                }
            }
        });
    })
    .catch(err => { 
        res.status(500).json({
                error: err
        });
    });
});




module.exports = router;