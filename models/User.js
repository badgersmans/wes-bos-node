const mongoose              = require('mongoose');
const md5                   = require('md5');
const validator             = require('validator');
const mongodbErrorHandler   = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address'],
        required: [true, 'Email is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);