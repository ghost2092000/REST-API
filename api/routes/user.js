const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const jwt = require('jsonwebtoken');

router.post("/signup", (req, res, next) => {

    //prevent from creating a user that has a email already in use
    User.find({email: req.body.email}) //this uses User model and looks for an email: where it is the same as req.body.email, aka what ever the user puts
        .exec()
        .then(user => {
            if(user.length >= 1){  //if there is a user with the same email:
                return res.status(409).json({
                    message:'This Email is already being used, try a different one'
                });
            } 
    // ^^^^^^^^^^^^^^^^^^
            else{
                bcrypt.hash(req.body.password,10,(err,hash) =>{
                    if (err) { 
                        return res.status(500).json({
                            error: err ,
                            message: "hi"
                        });
                    }
                    else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User Created!!!'
                            })
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(504).json({
                                error: err
                            });
                        });
                    }
                })
            }
        })
});


router.post('/login', (req, res, next) => {
        User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({ //Email not found 
                    message: "Auth Failed!"  
                });
            }
            bcrypt.compare(
                req.body.password, //this is the password that is stored
                user[0].password,   //this is the new password that it is checking for 
                (err, result) => {
                    if (err) { //if the compare fails 
                        return res.status(401).json({
                            message: 'Auth Failed'  
                        });
                    }
                    if(result){
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                        
                        return res.status(200).json({ // The password worked 
                            message: 'Auth Successful!!!',
                            token: token 
                        })
                    }
                    res.status(401).json({ //the password was incorrect 
                        message: 'Auth Failed'
                    });

                })
        })
        .catch(err =>{
            console.log(err);
            res.status(504).json({
                error: err,
                message: "there was an error?"
            });
        });
}); 




router.delete('/:userId', (req,res, next) => {
    User.remove({
        _id: req.params.userId
    })
    .exec()
    .then(result =>{
        res.status(200).json({
            message: "User was Deleted"
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(504).json({
            error: err
        });
    });
});


module.exports = router;