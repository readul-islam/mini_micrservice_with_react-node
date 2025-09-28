const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({path:'../.env'});
const PORT = process.env.POST_SERVER_PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())



app.get('/posts', (req, res)=>{
    res.send("Hello from post service");
})







app.listen(PORT,()=>{
    console.log(`Post server is running on port: ${PORT}`);
})