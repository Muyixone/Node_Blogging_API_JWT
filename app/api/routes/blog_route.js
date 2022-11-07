const express = require('express');

const {
  getAllBlogs,
  creatBlog,
  getBlogById,
  getUserArticle,
  updateBlog,
  deleteBlog,
} = require('../controllers/blog_controller');
const { authenticate } = require('../controllers/users_controller');

const router = express.Router();

router.route('/').get(getAllBlogs).post(authenticate, creatBlog);

router.route('/:id').get(getBlogById);

router
  .route('/blog_aticles/:id')
  .get(getUserArticle)
  .put(updateBlog)
  .delete(deleteBlog);

module.exports = router;
