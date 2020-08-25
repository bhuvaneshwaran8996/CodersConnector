const express = require('express');
const router = express.Router();
const Profile = require('../../model/Profiles')
const auth = require('../../middleware/auth')
const User = require('../../model/Users')
const {check,validationResult} = require('express-validator');
const config = require('config')
const request = require('request')

const Post = require('../../model/Post');


router.post('/',[auth,

    check('text','Text is required').not().isEmpty()
],async(req,res)=>{


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }

    try{
        const user = await  User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        });
       
        const post = await newPost.save();
        res.status(200).send(post);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

    router.get("/",auth,async(req,res)=>{
        try{
            const posts = await Post.find({}).sort({date: -1});
            if(posts!=null){

                res.status(200).json(posts);
            }else{

            }
            
        }catch(err){
            console.error(err.message);
            res.status(500).send("Server Error");
        }

    })

    router.get('/:id',auth,async(req,res)=>{

        try{
            const post = await Post.findById(req.params.id);
            if(!post){
                return res.status(404).json({msg:'Post not found'});

            }
            res.json(posts);
        }catch(err){
            console.error(err.message);
            if(err.kind === 'ObjectId'){
                return res.status(404).json({msg:'Post not found'});

    }
            res.status(500).send('Server Error');
        }
    });

 router.delete('/:id',auth,async(req,res)=>{

        try{
            const post = await Post.findById(req.params.id);
            
            await posts.remove();
            res.json({msg:'Post removed'})
            
        }catch(err){
            console.error(err.message);
            if(err.kind === 'ObjectId'){
                return res.status(404).json({msg:'Post not found'});
 
    }
            res.status(500).send('Server Error');
        }
    });
router.put('/like/:id',auth,async(req, res)=>{
    try{

        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){

            return res.status(400).json({msg:"Post already liked"});

        }

        post.likes.unshift({user:req.user.id})
        await post.save();
        res.json(post.likes);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
  }
})
router.delete('/unlike/:id',auth,async(req, res)=>{
    try{

        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0){

            return res.status(400).json({msg:"Post has not been liked"});

        }

     //Get remove index
     const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
     post.likes.splice(removeIndex,1);
        await post.save();
        res.json(post.likes);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
  }
})


//put reuquest for adding comments
//api/posts/comments/:id
router.post('/comments/:id',[auth,

    check('text','Text is required').not().isEmpty()
],async(req,res)=>{


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }

    try{
        const user = await  User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        };
        post.comments.unshift(newComment);
       await post.save();
        res.status(200).send(post.comments);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/comments/:id/:commentsid',auth,async(req, res)=>{
    try{

       const post = await Post.findById(req.params.id);

       //pull out the comment
      const comments =  post.comments.find(comment => comment.id === req.params.commentsid);


       if(!comments){
           return res.status(400).send({msg:"comments not found"});
       }

       if(comments.user.toString() !== req.user.id){
           return res.status(401).json({msg:"User not authorized"});
       }

     //Get remove index
     const removeIndex = post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);

     post.comments.splice(removeIndex,1);
        await post.save();
        res.json(post.comments);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
  }
})

module.exports  = router;