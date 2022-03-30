const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const isAuth = require('./isAuth');

const Store = require('../models/store');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

router.post('/addCategory', isAuth, async(req, res) => {
    const accountId = req.account._id;
    const store = await Store.findOne({associateId: accountId});
    const {categoryName, categoryImage, priority} = req.body;
    _category = new Category({
        _id: mongoose.Types.ObjectId(),
        storeId: store._id,
        categoryName: categoryName,
        categoryImage: categoryImage,
        priority: priority

    })
    return _category.save()
    .then(newCategory => {
        return res.status(200).json({
            category: newCategory
        })
    })
    .catch(err => {
        res.status(500).json({
            message: err
        })
    })
});

router.put('/updateCategory', isAuth, async(req, res) => { });
router.delete('/deleteCategory', isAuth, async(req, res) => {  });


router.post('/addProduct', isAuth, async(req, res) => {  });
router.put('/updateProduct', isAuth, async(req, res) => {  });
router.delete('/deleteProduct', isAuth, async(req, res) => {  });

module.exports = router;
