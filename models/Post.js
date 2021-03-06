const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: false
  },
  content: {
    type: String,
  }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;