import mongoose from "mongoose";

// Corrected from "mongoose.schema" to "mongoose.Schema" (capital 'S')
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    postID: {
        type: Number, // Keeping it as a Number as per your original code
        required: true,
        unique: true,  // Ensures the postID is unique
    },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Model name should be capitalized (e.g., "Post")
const postModel = mongoose.model("Post", schema);

export default postModel;
