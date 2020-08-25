const  mongoose = require('mongoose');

const ProfileSchemac = new mongoose.Schema({

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},

company:{
    type:String,
},

website:{
    type:String,
},
location:{
    type:String,
},
status:{
    type:String,
    required:true
},
skills:{
    type:[String],
    required:true
},
bio:{
    type:String
},
githubusename:{
    type:String
},
experience:[
    {
        title:{

            type:String,
            required:true
        },
        company:{
            type:String,
            required:true
        },
        location:{
            type:String
        },
        from:{
            type:Date,
            required:true
        },
        to:{
            type:Date,
            
        },
        current:{
            type:Boolean,
            required:true
        },
        description:{
            type:String
        }


    }
],
education:[
    {
        school:{
            type:String,
            required:true
          },
          degree:{
            type:String,
            required:true
          },
          fieldofstudy:{
            type:String,
            required:true
          },
          from:{
            type:String,
            required:true
          },
          to:{
            type:String,
       
          },
          current:{
              type:String,
              default:false
          }
          ,description:{
              type:String

          }


    }
],
social:{
    youtube:{
        type:String,
        required:true
    },
    twitter:{
        type:String,
        required:true
    },facebook:{
        type:String,
        required:true
        
      },
      linkedin:{
        type:String,
       
      },
      instagram:{
        type:String,
        
      },
},
date:{
    type:Date,
    default:Date.now
}
});

module.exports  = Profile = mongoose.model('profile',ProfileSchemac);