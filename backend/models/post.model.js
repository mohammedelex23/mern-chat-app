const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: 'text is required',
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
        }
    ]
})

const model = mongoose.model("Post", postSchema);
module.exports = model;
