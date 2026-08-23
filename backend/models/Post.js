const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  imageColor: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: null } // Path to uploaded image
}, {
  timestamps: true
});

// Create model if it doesn't exist, otherwise use existing
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

module.exports = Post;
