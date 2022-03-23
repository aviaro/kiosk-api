const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const storeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    associateId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    storeName: String,
    isTakewaway: Boolean,
    isDelivery: Boolean,
    subs: [
        {
            associateId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        }
    ],
    contactInfo: {
        email: String,
        mobile: String,
        phone: String,
        city: String,
        address: String,
        latitude: String,
        longtitude: String
    },
    storeDescription: String,
    workingHours: [
        {
            day: Number, fromHour: String, toHour: String, isOpen: Boolean
        }
    ],
    reviews: [
        {
            accountId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            reviewContext: String,
            creadAdt: { type: Date, default: Date.now },
            rank: Number,
            isPublished: Boolean

        }
    ],    
    logo: {type: String, default: 'https://e7.pngegg.com/pngimages/122/295/png-clipart-open-user-profile-facebook-free-content-facebook-silhouette-avatar-thumbnail.png'},
    creadAdt: { type: Date, default: Date.now },
    updateAdt: { type: Date, default: Date.now },    
    isLocked: {type: Boolean, default: false}
});


module.exports = mongoose.model('Store', storeSchema);