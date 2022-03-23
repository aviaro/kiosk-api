const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    storeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
    categoryName: String,
    categoryImage: {type: String, default: 'https://e7.pngegg.com/pngimages/122/295/png-clipart-open-user-profile-facebook-free-content-facebook-silhouette-avatar-thumbnail.png'},
    priority: Number
});


module.exports = mongoose.model('Category', categorySchema);