const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(express.json());

// Cors configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,              // Allow credentials (cookies)
}));

const PORT = process.env.PORT || 5000;

// PostgreSQL setup
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to database
pool.connect().then(client => {
  console.log('Connected to the database');
  client.release();
}).catch(err => {
  console.error('Error connecting to database:', err.message);
});

// Secret key for JWT (secure it in production)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// Register Route
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const emailExists = await pool.query('SELECT * FROM "user" WHERE email = $1;', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ errors: { email: "User already exists" } });
    }

    const usernameExists = await pool.query('SELECT * FROM "user" WHERE username = $1;', [username]);
    if (usernameExists.rows.length > 0) {
      return res.status(400).json({ errors: { username: "Username already taken, choose another" } });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      'INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Successfully Registered', user: newUser.rows[0] });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login Route (Generates JWT)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM "user" WHERE username = $1;', [username]);
    if (userExists.rows.length === 0) {
      return res.status(400).json({ errors: { username: "User doesn't exist" } });
    }

    const user = userExists.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ errors: { password: "Incorrect Password" } });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(token,user);


    res.status(200).json({ message: "Login Successful", token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.post('/addaccount', async (req, res) => {
  const { bank_name, account_no, account_type, balance } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const username = decoded.username;
    if (!username) {
      return res.status(401).json({ message: 'Invalid token: Missing username' });
    }

    const accExists = await pool.query('SELECT * FROM bank_accounts WHERE account_no = $1', [account_no]);
    if (accExists.rows.length > 0) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    const newAccount = await pool.query(
      'INSERT INTO bank_accounts (username, bank_name, account_no, account_type, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, bank_name, account_no, account_type, balance]
    );

    res.status(201).json({ message: 'Successfully Added', account: newAccount.rows[0] });

  } catch (err) {
    console.error('Error during account addition:', err);  // Log the actual error message
    res.status(500).json({ message: 'Server Error', error: err.message });
}
});


app.get('/fetchaccounts', async (req,res)=>{
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;
    if (!username) {
      return res.status(401).json({ message: 'Invalid token: Missing username' });
    }

    const result = await pool.query('SELECT * FROM bank_accounts WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User doesn't have any accounts" });
    } else{
      return res.status(200).json({accounts: result.rows});
    }
  } catch (err) {
    console.error('Error during fetching:', err.message);
    res.status(500).json({ message: 'Server Connection Error' });
  } 

})

app.post('/addcard', async(req,res)=>{
  const {card_type,issuer,card_number,card_name,balance,limit,account_no,expiry_month,expiry_year,account_holder} = req.body;
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({message: 'No token provided or invalid format'});
  }

  const token = authHeader.split(' ')[1];

  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;
    if(!username) {
      return res.status(401).json({ message: 'Invalid token: Missing username' });
    }

    const cardExists = await pool.query('SELECT * FROM wallets WHERE card_number = $1', [card_number]);
    if (cardExists.rows.length > 0) {
      return res.status(400).json({ message: 'Card already exists' });
    }

    const newCard = await pool.query('INSERT INTO wallets ("username","card_type", "issuer", "card_number", "card_name", "balance", "limit", "account_no", "expiry_month", "expiry_year", "account_holder") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',[username,card_type,issuer,card_number,card_name,balance,limit,account_no,expiry_month,expiry_year,account_holder]);

    res.status(201).json({ message: 'Successfully Added', card: newCard.rows[0] });

  }catch (err) {
    console.error('Error during card addition:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
  
});

app.get('/fetchcards', async (req,res)=>{
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;
    if (!username) {
      return res.status(401).json({ message: 'Invalid token: Missing username' });
    }

    const result = await pool.query('SELECT * FROM wallets WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User doesn't have any cards added" });
    } else{
      return res.status(200).json({cards: result.rows});
    }
  } catch (err) {
    console.error('Error during fetching:', err.message);
    res.status(500).json({ message: 'Server Connection Error' });
  } 

})

app.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await pool.query('SELECT * FROM "user" WHERE id = $1;', [decoded.id]);

    if (user.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: user.rows[0] });
  } catch (err) {
    console.error('Error verifying token:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Logout Route (Optional)
app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
  console.log('user loggedout successfully');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
