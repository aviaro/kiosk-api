const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const isAuth = require('./isAuth');

const Store = require('../models/store');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');


router.get('/getAllCategories', isAuth, async(req, res) => {
    const userId = req.account._id
    const store = await Store.findOne({associateId : userId})
    const storeCategories = await Category.find({storeId:store._id})
    return res.status(200).json({
      message: storeCategories
    })
  })

router.get('/getCategory/:id', isAuth, (req, res) => {
    const categoryId = req.params.id;
    Category.findById(categoryId)
    .then(category => {
        return res.status(200).json({
            category: category
        })
    })
    .catch(err => {
        return res.status(403).json({
            category: 'category not found'
        })
    })
})

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

router.put('/updateCategory/:id', isAuth, async(req, res) => {
    const categoryId = req.params.id;
    const {categoryName, categoryImage, priority} = req.body
    Category.findById(categoryId)
    .then(category => {
        if(category) {
            category.categoryName = categoryName
            category.categoryImage = categoryImage
            category.priority = priority
            return category.save()
            .then(updated_category => {
                return res.status(200).json({
                    category: updated_category
                })
            })
        } else {
            return res.status(403).json({
                message: 'Category not found'
            })
        }
    })
    .catch(err => {
        return res.status(403).json({
            Error: err
        })
    })
 });
router.delete('/deleteCategory/:id', isAuth, async(req, res) => { 
    const categoryId = req.params.id;
    Category.findByIdAndDelete(categoryId)
    .then(categoryDeleted => {
        return res.status(200).json({
            status: true,
            message: `${categoryDeleted.categoryName} is deleted`
        })
    })
    .catch(err => {
        return res.status(500).json({
            status: false,
            Error: err
        })
    })
 });


router.post('/addProduct/:categoryId', isAuth, async(req, res) => { 
    const accountId = req.account._id
    const categoryId = req.params.categoryId;
    const {
        productName,
        productImages,
        price,
        discount,
        unitInStock,
        desclimer,
        isAgeLimitation
    } = req.body
    const store = await Store.findOne({associateId: accountId});
    const _product = new Product({
        _id: mongoose.Types.ObjectId(),
        storeId: store._id,
        categoryId: categoryId,
        productName: productName,
        productImages: productImages,
        price: price,
        discount: discount,
        unitInStock: unitInStock,
        desclimer: desclimer,
        isAgeLimitation: isAgeLimitation
    })    
    return _product.save()
    .then(newProduct => {
        return res.status(200).json({
            status: true,
            product: newProduct
        })
    })
    .catch(err => {
        return res.status(500).json({
            status: false,
            Error: err
        })
    })
 });

 router.get('/getAllStoreProductProducts/', isAuth, async(req, res) => {
    const accountId = req.account._id;
    const store = await Store.findOne({associateId: accountId})
    await Product.find({storeId: store._id})
    .then(allProducts => {
        return res.status(200).json({
            storeProducts: allProducts
        })
    })
    .catch(err => {
        return res.status(500).json({
            Error: err
        })
    })
 })

 router.get('/getProductsByCategory/:categoryId', isAuth, async(req, res) => {
     const categoryId = req.params.categoryId;
     await Product.find({categoryId: categoryId})
     .then(products => {
         return res.status(200).json({
             Products: products
         })
     })
     .catch(err => {
         return res.status(500).json({
             Error: err
         })
     })
 })
router.put('/updateProduct', isAuth, async(req, res) => {  });
router.delete('/deleteProduct', isAuth, async(req, res) => {  });

module.exports = router;
