const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 360000,
    }
}));
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
        let errors = {};
        //checking if email exists already
        const emailExists = await pool.query('SELECT * FROM "user" WHERE email = $1;',[email]);
        if(emailExists.rows.length>0){
            
            return res.status(400).json({
                errors: {
                    email:"User already exists"
                }
            });
        }

        //checking if username exists
        const usernameExists = await pool.query('SELECT * FROM "user" WHERE username = $1;',[username]);
        if(usernameExists.rows.length>0){
            return res.status(400).json({errors: {
                username:"Username already taken , choose another"
            }});
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


app.post('/login',async(req,res)=>{
    const { username , password } = req.body;
    console.log('Received login data:', req.body);
    try{
        let errors = {};
        const userExists = await pool.query('SELECT * FROM "user" WHERE username = $1',[username]);
        if(userExists.rows.length === 0){
            console.log(userExists.rows);
            return res.status(400).json({ errors: {
                username: "User doesn't exist"
            }});
        }

        const user=userExists.rows[0];
        const passwordMatch = await bcrypt.compare(password,user.password);

        if(!passwordMatch){
            return res.status(400).json({ errors: {
                password: "Incorrect Password"
            }});
        }

        res.status(200).json({message:"Login Succesful",user:{ id:user.id , username:user.username , email:user.email}});
    }catch(err){
        console.log('Error during login',err);
        res.status(500).json({message:'server error'});
    }
})

app.get('/profile',(req,res)=>{
    if(req.session.user){
        res.status(200).json({user: req.session.user});
    }else{
        res.status(401).json({message: 'Unauthorized'})
    }
})

app.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).json({message: 'Erros logging out'})
        }
        res.clearCookie('connect.sid');
        res.status(200).json({message: 'Logged out Succesfully'});
    });
});

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});