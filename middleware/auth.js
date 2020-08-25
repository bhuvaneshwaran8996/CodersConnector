const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){

   
    const token = req.header('x-auth-token');
    if(!token){
        res.status(401).json({error:"No  authorization header found"})
    }
try{
  const decodeduser =   jwt.verify(token,config.get("jwtSecret"))
  

  req.user = decodeduser.users;

  console.log(req.user)
  next();
}catch(e){

   
    res.status(401).json({msg:"invalid token"})
}
   
};
