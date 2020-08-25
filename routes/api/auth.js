const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../model/Users')
const  gravatar = require('gravatar')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const auth = require('../../middleware/auth')

router.get("/",auth,async(req,res)=>{

  try{
      const user = await User.findById(req.user.id).select( "-password");
      
      if(user!=null){

          res.status(200).json(user);
      }
      
  }catch(err){
      console.error(err.message);
      res.status(500).send("Server Error");
  }

})

router.post('/',[
 

  body('email','Please include a valid email').isEmail(),
  body('password',"password is required").exists()

],async(req,res)=>{
  console.log(req.body);
   const error =  validationResult(req);
   if(!error.isEmpty()){
     return res.status(400).json({
       errors:error.array()
     });
   }
   const { email, password} = req.body;

   try{

    let user = await User.findOne({email})
    

    if(!user){

      return res.status(400).json({errors:[{msg:"Invalis crendentials"}]});

    }

   const ismatch = await bcrypt.compare(password,user.password);
   if(!ismatch){

    return res.status(400).json({errors:"Pssword does not match"});
   }

   
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
//    router.get("/",auth,async(req,res)=>{
//     try{
//         const users = await User.find({}).sort({date: -1});
//         if(users!=null){

//             res.status(200).json(users);
//         }else{

//         }
        
//     }catch(err){
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }

// })

   //Return jwt


    
})

module.exports  = router;