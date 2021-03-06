const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://nishigaba:hW0BnvwTVoBAieyr@cluster0.nb0uu.mongodb.net/node-angular?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
  console.log('Connected to Database!');
})
.catch(() => {
  console.log('Connection Failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req,res,next) =>{
  //Defines which domains are allowed to access our resources
  res.setHeader("Access-Control-Allow-Origin","*");
  //Incoming request may have these type of headers
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-with, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE, OPTIONS ")
  next();
});

app.post("/api/posts",(req,res,next)=> {
  const post = new Post({
    title : req.body.title,
    content : req.body.content
  });
  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message : 'Post Added Successfully!',
      postId : createdPost._id
    });
  });
});

app.get("/api/posts",(req,res,next)=> {
  Post.find()
  .then(documents => {
    res.status(200).json({
      message : "Posts fetched successfully!",
      posts: documents
    });
  });
});

app.delete("/api/posts/:id", (req,res,next)=> {
    console.log(req.params.id);
    Post.deleteOne({_id : req.params.id})
    .then(result => {
      console.log(result);
      res.status(200).json({ message : "Post Deleted!" });
    });
});

module.exports = app;
