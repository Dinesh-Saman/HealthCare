const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  image: {
    type: String,  // Assuming the image is stored as a URL or a file path
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['nutrition', 'mental health', 'disease prevention'],  // Define the valid categories
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publish_date: {
    type: Date,
    default: Date.now,  // Default to current date when the article is created
  },
  content: {
    type: String,
    required: true,
  },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
