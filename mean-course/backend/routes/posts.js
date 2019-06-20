const express = require("express");
const multer = require("multer");//allows us to interact with incoming file

const Post = require('../model/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/png': 'jpg',
};

const storage = multer.diskStorage({

  destination:(req,file,cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mime type');
    if(isValid) {
      error = null;
    }
    cb(error,"backend/images");
    },
    filename: (req,file,cb) =>{
      const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null,name+'-'+Date.now()+'.'+ext)
    }
})

router.get('',(req,res,next)=>{
console.log(req.query);
const pageSize = +req.query.pageSize;
const currentPage = +req.query.page;
let fetchtedPosts;
const postQuery = Post.find();
if(pageSize&&currentPage) {
  postQuery.skip(pageSize*(currentPage - 1))
  .limit(pageSize);
}
postQuery
  .then(documents =>{
    fetchtedPosts =documents;
   return Post.count();

  })
  .then(count=>{
    res.status(200).json({
      message: 'Posts fetchted Succesfully',
      posts: fetchtedPosts,
      maxPosts: count
    });
  });
});

router.put("",(req,res,next)=>{

  res.send('Update the book');
});
router.put(
  '/:id',
  multer({storage: storage}).single('image'),
  (req,res,next)=>{
    console.log(req.file);
    let imagePath = req.body.imagePath;
    if(req.file)
    {
      const url = req.protocol+'://'+req.get('host');
      imagePath = url+"/images/"+req.file.filename;
    }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath

  });
  console.log(post);
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
  });

  router.get('/:id',(req,res,next) =>{
    Post.findById(req.params.id).then(post=>{
      if (post) {

        res.status(200).json(post);
      } else {
        res.status(404).json({message:'Post not found'})
      }
    })
  });
  router.delete("/:id",(req,res,next)=>{
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result=>{
    console.log(result);
    res.status(200).json({message: "Post deleted!"});
  })
  res.status(200).json({message: "post deleted"});
});


router.post('',multer({storage: storage}).single('image'),(req,res,next) => {
  debugger;
  const url = req.protocol+'://'+req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+"/images/"+req.file.filename
  });

    post.save().then(createdPost => {
        res.status(201).json({
        message: 'Post Added Succes',
        post: {
          ...createdPost,
          id:createdPost._id,
        }
      });
    });
    //const post = req.body;
    //console.log(post);
    //post.id="23";
    //posts.push(post);

  });

module.exports = router;

