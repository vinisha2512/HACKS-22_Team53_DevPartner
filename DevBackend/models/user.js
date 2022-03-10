const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    resume: {
        Name: { type: String, required: true },
        pdf:
        {
            data: Buffer,
            contentType: String
        }
    },
    bio: { type: String },
    gitlink: { type: String },
    link: { type: String }
});

module.exports = mongoose.model('User', userSchema);