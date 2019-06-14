const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./model/post')
const app = express();

//mongoose.connect("mongodb+srv://test:f3JN5poiAlEQzHS8@cluster0-fm7pk.mongodb.net/node-angular?retryWrites=true&w=majority")
mongoose.connect('mongodb://localhost/node-angular', {useNewUrlParser: true})
.then(()=>{
  console.log('connected to database');
})
.catch(()=>{
  console.log('connection failed');
})
//f3JN5poiAlEQzHS8
app.use((bodyParser.json()));
//app.use((bodyParser.urlencoded({extended: false})));//

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

let posts = [
  {id: 'fad123123',
  title:'First server-side post',
   content: "this is coming for srever-side"
 },
 {id: 'kasa1212',
  title:'second server-side post',
   content: "this is coming for srever-side!"
 },
]
app.post('/api/posts',(req,res,next) => {
const post = new Post({
  title: req.body.title,
  content: req.body.content
});

  post.save().then(createdPost => {
      res.status(201).json({
      message: 'Post Added Succes',
      postId : createdPost._id
    });
  });
  //const post = req.body;
  //console.log(post);
  //post.id="23";
  //posts.push(post);

});
app.get('/api/posts',(req,res,next)=>{

  Post.find()
  .then(documents =>{
    res.status(200).json({
      message: 'Posts fetchted Succesfully',
      posts: documents
    });
  });
});

app.put("api/posts",(req,res,next)=>{

  res.send('Update the book');
});
app.put('/api/posts/:id',(req,res,next)=>{
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
  });

  app.get('/api/posts/:id',(req,res,next) =>{
    Post.findById(req.params.id).then(post=>{
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message:'Post not found'})
      }
    })
  });
app.delete("/api/posts/:id",(req,res,next)=>{
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result=>{
    console.log(result);
    res.status(200).json({message: "Post deleted!"});
  })
  res.status(200).json({message: "post deleted"});
});


module.exports = app;
