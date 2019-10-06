const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const restaurantSchema = new Schema ({
    name: {type: String, require: true},
    image: {type: String, require: true},
    description: {type: String, require: true},
    openHours: {type: Number, require: true},
    closeHours: {type: Number, require: true},
    phoneNo: {type: Number, require: true},
    cuisine: {type: String, require: true},
    goodFor: {type: String, require: true},
    comments: [
        {
            comment: {type: String},
            username: {type: String}
        }
    ]
});

module.exports = mongoose.model('View', restaurantSchema);