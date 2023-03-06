const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fName: { type: String},
    lName: { type: String},
    email: { type: String, required: true, unique: true },
    profilePicture: {
        filename: { type: String, default: null },
        url: { type: String, default: null }
    },
    password: { type: String, required: true },
    date: { type: Date, default: new Date() }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('displayName').get(function() {
    return `${this.fName} ${this.lName}`;
});

module.exports = mongoose.model('user' , userSchema)