const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require('bcryptjs')

const User = require('../models/user');

router.post('/creatAccount', async(req, res) => {
    //Get user inputs
    const { firsName, lastName, email, password, mobile } = req.body;
    //Check if user exist
    User.findOne({ email: email })
    .then(async account => {
        
        if(account) {
            
            return res.status(200).json({
                message: `User is alredy exist, please try other email`
            });
        } else {
            //Crypt password
            const formatted_password = await bcryptjs.hash(password, 10);
            //Generate passcode
            const passcode = generateRandomIntegerInRange(1000,9999);

            //Creat user in mongoDB
            const _user = new User({
                _id: mongoose.Types.ObjectId(),
                email: email,
                password : formatted_password,
                mobile: mobile,
                firstName: firsName,
                lastName: lastName,
                passcode: passcode
            })
            _user.save()
            .then(accountCreated => {
                return res.status(200).json({
                    message: accountCreated
                });
            })            
        }        
    })
    .catch(err => {
        
        return res.status(500).json({
            message: err
        });
    });    
    
    
    //Response  

});


router.get('/sayHello', async(req,res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            message: users
        });
    } catch (error) {
        console.log(error);
    }
    
});

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = router;