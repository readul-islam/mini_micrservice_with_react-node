const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({path:'../.env'});
const PORT = process.env.COMMENT_SERVER_PORT || 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())



app.get('/comments', (req, res)=>{
    res.send("Hello from post service");
})







app.listen(PORT,()=>{
    console.log(`Comments server running on port: ${PORT}`);
})