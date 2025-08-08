import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    content: {type: String, required: true},
    rating: {type: Number, min: 1, max: 5, required: true}
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;