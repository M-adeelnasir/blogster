const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');


const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {

    try {
      const redis = require('redis');
      const client = redis.createClient()
      // client.on('error', (err) => console.log("Redis client error ", err))
      // client.connect().then(() => console.log("Redis connected..."))
      const util = require('util');

      client.get = util.promisify(client.get)

      //have already data in cache then serve from cache
      const blogCache = await client.get(req.user.id)
      if (blogCache) {
        console.log("SERVERVING FROM CACHE");
        return res.send(JSON.parse(blogCache))
      }

      //if no then get data from db and responed to client and then save it in cache
      const blogs = await Blog.find({ _user: req.user.id });
      res.send(blogs);

      console.log("SERVERVING FROM DB");
      client.set(req.user.id, JSON.stringify(blogs))


    } catch (err) {
      console.log(err);
    }

  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
