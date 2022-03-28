const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const isAuth = require('./isAuth');
const Store = require('../models/store');
const User = require('../models/user');

router.post('/creatStore', isAuth, async(req, res) => {
    const accountId = req.account._id
    const isStoreExist = await Store.findOne({associateId: accountId})
    if(isStoreExist){
        return res.status(200).json({
            message: 'You have already have store!'
        })
    } else {
        const _user = User.findById(accountId);
        _user.isBusiness = true;
        const {storeName, isTakewaway, isDelivery, storeDescripation, contactInfo} = req.body;        
        const _store = new Store({
            _id: mongoose.Types.ObjectId(),
            associateId: accountId._id,
            storeName: storeName,
            isTakewaway: isTakewaway == "Yes"? true : false,
            isDelivery: isDelivery == "Yes"? true : false,
            storeDescription: storeDescripation,
            contactInfo: contactInfo
        })
        return _store.save()
        .then(storeCreated => {
            return res.status(200).json({
                store: storeCreated,
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
        
    }
  })




module.exports = router