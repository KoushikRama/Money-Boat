const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT;

//connection setup
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// checking for connection
pool.connect().then(client => {
    console.log('Connected to the database');
    client.release();
}).catch(err =>{
    console.error('error connecting to database', err);
})

//register 
app.post('/register', async(req,res) => {
    const { email , username , password } = req.body;

    try{
        //checking if email exists already
        const emailExists = await pool.query('SELECT * FROM "user" WHERE email = $1;',[email]);
        if(emailExists.rows.length>0){
            return res.status(400).json({message: "User already exists"});
        }

        //checking if username exists
        const usernameExists = await pool.query('SELECT * FROM "user" WHERE username = $1;',[username]);
        if(usernameExists.rows.length>0){
            return res.status(400).json({message: "Username already taken , choose another"});
        }

        const saltRounds = 10;

        // crypting password
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        const newUser = await pool.query('INSERT INTO "user" (username,email,password) VALUES ($1,$2,$3) RETURNING *',[username,email,hashedPassword]);

        res.status(201).json({message:'Succesfully Registered', user: newUser.rows[0]});


    }
    catch(err){
        console.log('error during registration',err);
        res.status(500).json({message:'server Error'});
    }

})


app.get('/',(req,res)=>{
    res.send('Welcome to MoneyBoat backend <h1>Hello</h1>');
})

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});