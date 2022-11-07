const mongoose = require('mongoose');
const user = require('./users_model');

const Schema = mongoose.Schema;

//BlogPost schema
const BlogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title missing, provide a title'],
      unique: [true, 'Title name already exists'],
    },
    description: {
      type: String,
      required: [true, 'Description missing, provide a description'],
    },
    author: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: String,
      required: [true, 'Provide a reading_time'],
    },
    tags: {
      type: String,
      required: [true, 'Specify tags'],
    },
    body: {
      type: String,
      required: [true, 'Body is needed'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BlogPost', BlogPostSchema);
