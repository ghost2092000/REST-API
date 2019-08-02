const express = require('express'); //this calls the npm express thing we downloaded 
const app = express(); //what uses this const will call the express method
const morgan = require('morgan'); //this is used for logging incoming request
const bodyParser = require('body-parser'); //this is needed in order to parse the body of a request

const mongoose = require('mongoose'); //

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const userRoutes = require('./api/routes/user')

//this is used to get the url for images
app.use('/uploads', express.static('uploads'));


//This has the link to mongoDB, and  process.env.MONGO_ATLAS_PW is what stores my password
mongoose.connect('mongodb+srv://Roberto:' + process.env.MONGO_ATLAS_PW +'@cluster0-pzllp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

//{ this has to be in this position
app.use(morgan('dev'));  //used for upcoming request

//Needed when parsing a body {
app.use(bodyParser.urlencoded({extended: false})); // use false for simple bodys 
app.use(bodyParser.json());

//This is used for CORS
app.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin', '*'
    );  //this will adjust the responses, * means that it will accept it from any

    // res.header('Access-Control-Allow-Origin', 'http://my-cool-page.com'); 'http://my-cool-page.com' means that it will only accept it from that link 
    
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// } }


// Routes that should handle Requests
app.use('/products', productRoutes); // this is used so i don't have to use the whole url, so like a filer 
app.use('/orders', orderRoutes);     // this is used so i don't have to use the whole url, so like a filer 
app.use('/user', userRoutes);


//{This is used to handle request that were made but don't return anything
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
//this is incase we get an error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
        res.json({
            error:{
                message: error.message
            }
        });

});
//}


module.exports = app;