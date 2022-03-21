const { sendStatus } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {

    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        

        jwt.verify(bearerToken, "A6cXZ9Mj5hM4As2wiIugIz5DHNO3q1VF", (err, authData) => {
            if(err){
                return res.sendStatus(403);
            } else {
                User.findById(authData._id)
                .then(account => {
                    req.token = bearerToken;
                    req.account = account;
                    next();
                })
                .catch(err => {
                    return res.sendStatus(403);
                })
            }
        });
    } else {
        return res.sendStatus(403);
    }
    console.log(bearerHeader);
} 
