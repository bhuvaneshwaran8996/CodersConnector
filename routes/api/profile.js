const express = require('express');
const router = express.Router();
const Profile = require('../../model/Profiles')
const auth = require('../../middleware/auth')
const User = require('../../model/Users')
const {check,validationResult} = require('express-validator');
const config = require('config')
const request = require('request')

router.get('/me',auth,async(req,res)=>{

    try{

    
        const profile = await Profile.findOne({user:req.user.id}).populate('user',
        ['name','avatar']);

        if(!profile){

            return res.status(400).json({msg:"There is no Profile forthis user"});
        }
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");

    }




  
})

router.post('/',[auth,[
    check('status',"Status is required").not().isEmpty(),
    check('skills','Skillsis required').not().isEmpty()
]],async(req,res)=>{

  const errors = validationResult(req);
  if(!errors.isEmpty()){
     return  res.status(400).json({errors})

  }
  console.log(req.body)
  const {

    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  const profileFields = {};
  
  profileFields.user  = req.user.id;
  if(company)profileFields.company = company;
  if(website)profileFields.website = website;
  if(location)profileFields.location = location;
  if(bio)profileFields.bio = bio;
  if(status)profileFields.status = status;
  if(githubusername)profileFields.githubusername = githubusername;
  if(skills){
      profileFields.skills = skills.split(',').map(skill=>skill.trim());

  }

  profileFields.social = {}
  if(youtube)profileFields.social.youtube = youtube;
  if(twitter)profileFields.social.twitter = twitter;
  if(facebook)profileFields.social.facebook = facebook;
  if(linkedin)profileFields.social.linkedin = linkedin;
  if(instagram)profileFields.social.instagram = instagram;

 
  try{

   let profile= await Profile.findOne({user:req.user.id});

   if(profile){ //update
 
    profile = await Profile.findOneAndUpdate(
        {user:req.user.id},
        {$set:profileFields},
        {new:true}
    );
    return res.json(profile);
   }


   //create
   profile = new Profile(profileFields);
   await profile.save();
   res.json(profile)
  }catch(e){

    console.error(e.message);
    res.status(500).status("Server error")

  }


   
});

router.get('/',async(req,res)=>{

try{
 const profiles   = await Profile.find().populate('user',['name','avatar']);
res.json(profiles)
}catch(e){

    console.err(e.message);
    res.status(500).status("Server error");

}
})

router.get('/user/:user_id',async(req,res)=>{

    try{
        const profile =  await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile){
            res.send("No profile found");
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.delete('/',auth,async(req,res)=>{

    try{
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id});
   
        res.json({msg:"User removed"});
    }catch(err){
        console.err(err.message);
        res.status(500).send("Server error")

    }
})

router.put('/experience',[auth,[
    check('title','title is requires').not().isEmpty(),
    check('company','company is requires').not().isEmpty(),
    check('from','from is requires').not().isEmpty(),
]],async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }


    const {
        title,
        company,
        location,
        from,
        to,
        current,
        dscription
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try{

        const profile =await Profile.findOne({user:req.user.id});

        profile.experience.unshift(newExp);
      await  profile.save();
      res.json(profile);
    }catch(err){

       
        console.error(err.message);
        res.status(500).send("Server error");
    }
 
})


router.delete('/experience/:exp_id',auth,async(req,res)=>{

    try{

        const profile = await Profile.findOne({user:req.user.id});
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.status(400).send(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');


    }
});





router.put('/education',[auth,[
    check('school','school is required').not().isEmpty(),
    check('degree','degree is requires').not().isEmpty(),
    check('fieldofstudy','fromfieldofstudy is requires').not().isEmpty(),
]],async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }


    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu= {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try{

        const profile =await Profile.findOne({user:req.user.id});

        profile.education.unshift(newEdu);
      await  profile.save();
      res.json(profile);
    }catch(err){

       
        console.error(err.message);
        res.status(500).send("Server error");
    }
 
})


router.delete('/education/:edu_id',auth,async(req,res)=>{

    try{

        const profile = await Profile.findOne({user:req.user.id});
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.status(400).send(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');


    }
});

router.get('/github/:username',(req,res)=>{

    try{
        const option = {
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubID')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent':'node.js'}

        };

        request(option,(error, response,body)=>{
            if(error) console.error(error);
            if(response.statusCode!= 200){

                res.status(404).json({msg:"No github profile found"});

            }
            res.json(JSON.parse(body));
        });
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

module.exports  = router;