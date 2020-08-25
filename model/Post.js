const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const PostSchema = new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    text:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    
    likes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
            }
        }
    ],
    comments:[
       {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        },
        text:{
            type:String,
           
        },
        avatar:{
            type:String,
          
        },
         }
    ],
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports = Post = mongoose.model('post',PostSchema);

