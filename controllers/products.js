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
    await Store.findOne({associateId : userId})
    .then(async store => {
        if(store) {
            await Category.find({storeId:store._id})
            .then(storeCategories => {
                return res.status(200).json({
                    message: storeCategories
                })
            })
            
        } else {
            return res.status(403).json({
                category: 'Store not found'
            })    
        }
    })
    .catch(err => {
        return res.status(500).json({
            Error: err
        })
    })
    
  })

router.get('/getCategory/:id', isAuth, (req, res) => {
    const categoryId = req.params.id;
    Category.findById(categoryId)
    .then(category => {
        if(category) {
            return res.status(200).json({
                category: category
            })
        } else {
            return res.status(403).json({
                category: 'category not found'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            Error: err
        }) 
    })
})

router.post('/addCategory', isAuth, async(req, res) => {
    const accountId = req.account._id;
    await Store.findOne({associateId: accountId})
    .then(async store => {
        if(store) {
            const {categoryName, categoryImage, priority} = req.body;
            await Category.findOne({categoryName: categoryName})
            .then(category => {
                if(category) {
                    return res.status(200).json({
                        message: `There is already category with the name ${categoryName}`
                    })
                } else {
                    const _category = new Category({
                        _id: mongoose.Types.ObjectId(),
                        storeId: store._id,
                        categoryName: categoryName,
                        categoryImage: categoryImage,
                        priority: priority
                    })
                    return _category.save()
                    .then(newCategory => {
                        return res.status(200).json({
                            Category: newCategory
                        })
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    Error: err
                })
            })
        } else {
            return res.status(403).json({
                message: 'Store not exist'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            Error: err
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
        return res.status(500).json({
            Error: err
        })
    })
 });

router.delete('/deleteCategory/:id', isAuth, async(req, res) => { 
    const categoryId = req.params.id;
    Category.findByIdAndDelete(categoryId)
    .then(categoryDeleted => {
        if(categoryDeleted) {
            return res.status(200).json({
                status: true,
                message: `${categoryDeleted.categoryName} is deleted`
            })
        } else {
            return res.status(403).json({
                status: false,
                message: `Category not found`
            })
        }
        
    })
    .catch(err => {
        return res.status(500).json({            
            Error: err
        })
    })
 });


router.post('/addProduct/:categoryId', isAuth, async(req, res) => { 
    const accountId = req.account._id
    await Store.findOne({associateId: accountId})
    .then(async store => {
        if(store) {
            const categoryId = req.params.categoryId
            await Category.findById(categoryId)
            .then(async category => {
                if(category) {
                    const {
                        productName,
                        productImages,
                        price,
                        discount,
                        unitInStock,
                        desclimer,
                        isAgeLimitation
                    } = req.body
                    await Product.findOne({productName: productName})
                    .then(product => {
                        if(product) {
                            return res.status(200).json({
                                message: `There is already product ${productName}`
                            })
                        } else {
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
                        }
                    })
                } else {
                    return res.status(403).json({
                        message: 'Category not found'
                    })
                }
            })
        } else {
            return res.status(403).json({
                message: 'Store Not found'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            status: false,
            Error: err
        })
    })
 });

 router.get('/getAllStoreProducts/', isAuth, async(req, res) => {
    const accountId = req.account._id;
    await Store.findOne({associateId: accountId})
    .then(async store => {
        if(store) {
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
        } else {
            return res.status(403).json({
                message:'Store not found'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            Error: err
        })
    })
 })

 router.get('/getProductsByCategory/:categoryId', isAuth, async(req, res) => {
     const accountId = req.account._id;
     await Store.findOne({associateId: accountId})
     .then(async store => {
        if(store) {
            const categoryId = req.params.categoryId;
            await Category.findById(categoryId)
            .then(async category => {
                if(category) {
                    await Product.find({categoryId: categoryId})
                    .then(products => {
                        return res.status(200).json({
                            Products: products
                        })
                    })
                } 
                else {
                    return res.status(403).json({
                        message: 'Category not found'
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    message: err
                })
            })      
        } else {

        }
    })
    .catch(err => {
        return res.status(500).json({
            Error: err
        })
    })
 })

 router.get('/getProduct/:productId', isAuth, async(req, res) => {
     const productId = req.params.productId;
     await Product.findById(productId)
     .then(product => {
         if(product){
             return res.status(200).json({
                 Product: product
             })
         } else {
             return res.status(403).json({
                 message: 'Product not found'
             })
         }
     })
     .catch(err => {
         return res.status(500).json({
             Error: err
         })
     })
 })


router.put('/updateProduct/:productId', isAuth, async(req, res) => { 
    const productId = req.params.productId;
    await Product.findById(productId)
    .then(product => {
        if(product) {
            const {
                productName,
                productImages,
                price,
                discount,
                unitInStock,
                desclimer,
                isAgeLimitation
            } = req.body;
            product.productName = productName;
            product.productImages = productImages;
            product.price = price;
            product.discount = discount;
            product.unitInStock = unitInStock;
            product.desclimer = desclimer;
            product.isAgeLimitation = isAgeLimitation;
            return product.save()
            .then(updated_category => {
                return res.status(200).json({
                    Product: updated_category
                })
            })
            .catch(err => {
                return res.status(500).json({
                    Error: err
                })
            })
        } else {
            return res.status(403).json({
                message: 'Product not found'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            Error: err
        })
    })
 });
router.delete('/deleteProduct/:productId', isAuth, async(req, res) => { 
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId)
    .then(deletedProduct => {
        if(deletedProduct) {
            return res.status(200).json({
                message: `${deletedProduct.productName} is deleted`
            })
        } else {
            return res.status(403).json({
                message: 'product not found'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            Error: err
        })
    })
 });

module.exports = router;
