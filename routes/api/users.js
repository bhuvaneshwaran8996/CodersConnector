const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../model/Users')
const  gravatar = require('gravatar')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')

router.post('/',[
 
  body('name','name is required').not().isEmpty(),
  body('email','Please include a valid email').isEmail(),
  body('password',"password length must be atleast 6 characters").isLength({min:6})

],async(req,res)=>{
  console.log(req.body);
   const error =  validationResult(req);
   if(!error.isEmpty()){
     return res.status(400).json({
       errors:error.array()
     });
   }
   const {name, email, password} = req.body;
   console.log(req.headers);

   try{

    let user = await User.findOne({email})

    if(user){

      return res.status(400).json({errors:[{msg:"User already exists"}]});

    }
    const avatar = gravatar.url(email,{

      s:'200',
      r:'pg',
      d:'mm'
    })

   user  = new User({
      name,
      email,
      avatar,
      password
    });

    const salt =await bcrypt.genSalt(10);

 
    user.password = await bcrypt.hash(password,salt);


   await user.save();
   const payload = {

    users:{
      id:user.id
    }
  };
  
  
  jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},(err,token)=>{

    if(err) {
      console.log(err)
    }
   return res.json({token})


  })
  
   
  }catch(err){

    console.error(err.message);
    res.status(500).send("Server error");
   }
   // see user if exists


   //Get users gravatar

   //Encryt password


   //Return jwt


    
})

module.exports  = router;