const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {

    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){

    } else {
        return res.sendStatus(403);
    }
    console.log(bearerHeader);
} 
