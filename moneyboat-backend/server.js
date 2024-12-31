const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const pg = require('pg');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT;


app.get('/',(req,res)=>{
    res.send('Welcome to MoneyBoat backend <h1>Hello</h1>');
})

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});