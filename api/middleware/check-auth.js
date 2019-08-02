const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    //used for verifying a token 
    try{
        const token = req.headers.authorization;
        console.log(token);
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch (error){
        return res.status(401).json({
            message: 'Auth Failed!!! =C'
        });
    }
     
};