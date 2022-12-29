const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const morgan = require('morgan')
const local = require('./strategies/local')
// const store = new session.MemoryStore();
const authRoute = require('./routes/auth')



app.use(session({
    secret: 'abcd',
    cookie: { maxAge: 600000 },
    saveUninitialized: false,
    resave: false
    // store
}));

require("dotenv").config();

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(morgan('combined'))

app.use(passport.initialize());
app.use(passport.session());

//create connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.PASS,
    database: 'users'
});


app.post('/register', async (req, res) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.passwd, 10)
        const connection = await db.getConnection();
        const query = 'INSERT INTO users (username, passwd, email, phoneNumber, age, sport) VALUES (?, ?, ?, ?, ?, ?)';
        try {
        const [results] = await db.execute(query, 
            [req.body.username, hashedPassword, req.body.email, req.body.phoneNumber, req.body.age, req.body.sport]);
        connection.release();
        // Success!
        } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.log('Duplicate entry')
            // Handle duplicate entry error here
            res.send(`<script>alert('Käyttäjänimi tai sähköposti on jo olemassa!')</script>`)
        } else {
            console.log(err)
            // Handle other errors here
        }
        }
        const user = {
            name : req.body.username,
            email : req.body.email,
            phoneNumber : req.body.phoneNumber,
            age : req.body.age,
            sport : req.body.sport
        }
        res.render('selectcoach', {user: user});
    } catch (err){
        console.log(err);
        res.status(500).send("Server error<br>" + err)
    }
})

app.get('/', async (req, res) => {
    if(req.user){
        const connection = await db.getConnection();
        const [results] = await db.query(`SELECT * FROM Users WHERE username = '${req.user.username}';`)
        connection.release();
        const user = {
            name : results[0].username,
            phone : results[0].phoneNumber,
            age : results[0].age,
            id : results[0].id,
            sport : results[0].sport
        };

        res.render('profile', {user: user})
    } else {
        res.redirect('/login');
    }
})

app.get('/login', (req, res) => {
    if(req.user){
        res.redirect('/');
    } else {
        res.render('login');
    }
})

app.get('/test', (req, res) => {
    console.log('tet');
    res.send('moro');
})

app.use('/auth', authRoute);

app.listen(3000)

