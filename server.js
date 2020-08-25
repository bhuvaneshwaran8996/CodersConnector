const express = require('express');

const bodyParser = require('body-parser')
const app  = express();
const connectDB = require('./config/db')
connectDB()
const port = process.env.PORT || 5000;

// init middleware
app.use(bodyParser.json());

// inint routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/posts',require('./routes/api/posts'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));

app.post('/',(req,res)=>{
    // console.log(req.headers)


    // res.send("API Running");
    setTimeout(()=>{
        res.send("API Running");
    })
},60000)
app.listen(port,()=>{

    console.log("The express server is running in thr port "+port)
})