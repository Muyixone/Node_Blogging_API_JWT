const blogModel = require('../models/blog_model');
const userModel = require('../models/users_model');
//const userService = require('../Services/UserServices');

const tryCatchErr = require('../utilities/catchErrors');
const serverError = require('../utilities/serverError');

require('dotenv').config();

///////////////////////////////////////////////////////////////
/*
 * Get all blog posts
 *
 */

///////////////////////////////////////////////////////////////

exports.getAllBlogs = tryCatchErr(async (req, res, next) => {
  const objectQuerry = { ...req.query };

  /// Filteration
  const removedFields = ['page', 'sort', 'limit', 'fields'];
  removedFields.forEach((field) => delete objectQuerry[field]);

  let query = blogModel.find(objectQuerry);

  // Sorting
  if (req.query.sort) {
    const sortParams = req.query.sort.split(',').join(' ');
    query = query.sort(sortParams);
  } else {
    // sorting by the most recent blog posted
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  if (req.query.page) {
    const numArticles = await blogModel
      .countDocuments()
      .where({ state: 'Published' });
    if (skip >= numArticles) {
      throw new serverError('Page does not exist', 404);
    }
  }

  query = query.skip(skip).limit(limit);

  //Displaying a single published blop post
  const publishedBlogPost = await blogModel
    .find(query)
    .where({ state: 'Published' })
    .populate('user', { firstname: 1, lastname: 1, _id: 1 });

  res.status(200).json({
    status: 'success',
    result: publishedBlogPost.length,
    curentPage: page,
    limit: limit,
    totalPages: Math.ceil(publishedBlogPost.length / limit),
    data: {
      publishedBlogPost,
    },
  });
});

////////////////////////////////////////////////////////////////
/*
 * CREAT A NEW BLOG ARTICLE
 * route: get /api/blogs
 */
////////////////////////////////////////////////////////////////
exports.creatBlog = tryCatchErr(async (req, res, next) => {
  const { title, description, state, tags, body } = req.body;

  if (!title || !description || !state || !tags || !body) {
    return next(new serverError('Provide all required information', 401));
  }

  // Get/Authenticate the user creating the blog
  const user = await userModel.findById(req.user._id);
  console.log(req.user._id);

  //Calculating the average read time of the blog
  let avgWPM = 250;
  const readTime = Math.ceil(body.split(/\s+/).length / avgWPM);
  const reading_time =
    readTime < 1 ? `${readTime + 1} minute read` : `${readTime} minutes read`;

  const author = `${user.firstname} ${user.lastname}`;

  const newblogArticle = new blogModel({
    title: title,
    description: description,
    author: req.user._id,
    reading_time: reading_time,
    state: state,
    tags: tags,
    body: body,
    user: user._id,
  });

  //   //save the blog article
  const savedBlogArticle = await newblogArticle.save();

  //Add the article to the author's blogs
  user.articles = user.articles.concat(savedBlogArticle._id);

  await user.save();
  res.status(201).json({
    message: 'Blog Article Created successfully',
    data: {
      blog: savedBlogArticle,
    },
  });
});

/////////////////////////////////////// ////////////////////////
/*
 * Get a single blog post
 * Get /api/blogs/:id
 */
////////////////////////////////////////////////////////////////

exports.getBlogById = tryCatchErr(async (req, res, next) => {
  const blog = await blogModel
    .findById(req.params.id)
    .where({ state: 'Published' })
    .populate('user', { firstname: 1, lastname: 1, _id: 1 });

  if (!blog) {
    return next(new serverError('Blog article not found', 404));
  }

  //Updating the read count
  blog.read_count += 1;

  //Save to DB
  blog.save();

  res.status(201).json({
    status: 'Success',
    blog,
  });
});

//////////////////////////////////////////////////////////////////
/*
 * Get all blog posts by user ID
 * Get /api/blogs
 */
//////////////////////////////////////////////////////////////////
exports.getUserArticle = tryCatchErr(async (req, res, next) => {
  const user = req.user;

  const queryObject = { ...req.query };

  const removedFields = ['page', 'sort', 'limit'];
  removedFields.forEach((field) => delete queryObject[field]);

  let blogQuerry = blogModel.find({ user });

  // Sorting
  if (req.blogQuerry.sort) {
    const sortBy = req.blogQuerry.sort.split(',').join(' ');
    blogQuerry = blogQuerry.sort(sortBy);
  } else {
    blogQuerry = blogQuerry.sort('-createdAt'); // default sorting : starting from the most recent
  }

  // Pagination
  // convert to number and set default value to 1
  const page = req.blogQuerry.page * 1 || 1;
  const limit = req.blogQuerry.limit * 1 || 20;
  const skip = (page - 1) * limit;

  if (req.blogQuerry.page) {
    const numArticles = await blogQuerry.countDocuments();
    if (skip >= numArticles)
      throw new serverError('This page does not exist', 404);
  }
  blogQuerry = blogQuerry.skip(skip).limit(limit);

  blogQuerry = blogQuerry.populate('user', {
    firstname: 1,
    lastname: 1,
    _id: 1,
  });

  const articles = await blogQuerry;

  return res.status(200).json({
    status: 'success',
    result: articles.length,
    data: {
      articles: articles,
    },
  });
});

/////////////////////////////////////////////////////////////////////
/*
 * Update blog post by Author

 */
////////////////////////////////////////////////////////////////////////////////////////////////

exports.updateBlog = tryCatchErr(async (req, res, next) => {
  const { title, description, state, tags, body } = req.body;

  const user = req.user;

  const blogPostId = await blogModel.findById(req.params.id);
  //confirm user credentials
  if (user.id !== blogPostId.user._id.toString()) {
    return next(
      new serverError('Authorization is required to update this document', 401)
    );
  }

  //Update Blog
  const updatedBlogPost = await blogModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: title,
        description: description,
        state: state,
        tags: tags,
        body: body,
      },
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: 'Success',
    data: {
      updatedBlogPost,
    },
  });
});

//////////////////////////////////////////////////////////////////////
/*
 *Delete blog post by Author
 * Protected route
 */
//////////////////////////////////////////////////////////////////////
exports.deleteBlog = tryCatchErr(async (req, res, next) => {
  const user = req.user;

  const blogPostId = await blogModel.findById(req.params.id);
  const blogAuthor = await userModel.findById(user.id);

  //console.log(blogPostId, blogAuthor);

  if (user.id !== blogPostId.user._id.toString()) {
    return next(
      new serverError('Authorization is required to delete this document')
    );
  }
  await blogModel.findByIdAndDelete(req.params.id);

  const index = blogAuthor.articles.indexOf(req.params.id);
  if (index === -1) {
    return next(new serverError('Blog post not found', 404));
  }
  blogAuthor.articles.splice(index, 1);
  await blogAuthor.save();

  res.status(201).json({
    status: 'Success',
    message: 'Blog post deleted successfully',
  });
});
