
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    alias: String,
    favorites: [{name: String, part_id: String, part_url: String, part_img_url: String, category: String}],
    favoriteGroup: [{favoriteSet: String}]
    
});

var User = mongoose.model('User', UserSchema);



module.exports = User;