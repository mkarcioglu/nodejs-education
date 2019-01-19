const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type:String, required: true, unique: true, minlength:1, maxlength:50},
    password: {type:String, required: true},
    name: {type:String, minlength:1, maxlength:15},
    surname: {type:String, minlength:1, maxlength:20},
    facebook_id: {type:String}
   
});

module.exports = mongoose.model('user', UserSchema);