const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const local = require('./strategies/local')
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

app.get('/messages', async (req, res) => {
    if(!req.user){
        res.redirect('/login');
    }
    const connection = await db.getConnection();
    try {
        const [results] = await db.query(`SELECT * FROM Users WHERE username = '${req.user.username}';`)
        const [messages] = await db.query(`SELECT * FROM Messages WHERE recipient = '${req.user.username}';`);
        const [userlist] = await db.query(`SELECT * FROM Users;`);
        const [user] = results;
        res.render('messages', {user: user, messages: messages});
    } catch (err) {
        console.log(err);
    }
    connection.release();    
})

app.post('/get-messages', async (req, res) => {
    if(!req.user){
        res.redirect('/login');
    }
    const connection = await db.getConnection();
    const [receivedMessages] = await db.query(`SELECT * FROM Messages WHERE recipient = '${req.user.username}'
    AND sender = '${req.body.sender}';`);


    const [sentMessages] = await db.query(`SELECT * FROM Messages WHERE recipient = '${req.body.sender}'
    AND sender = '${req.user.username}';`);


    res.json({receivedMessages, sentMessages});
})

app.post('/send-message', async (req, res) => {
    if(!req.user){
        res.redirect('/login');
    }

    const messagedata = req.body.message;

    const connection = await db.getConnection();

    //get user to send message to
    //insert into messages (message, recipient, sender, time)
    const recipient = messagedata.recipient;
    const sender = req.user.username;
    const currentTime = new Date().getTime().toString();
    const message = messagedata.messagetext;

    const query = 'INSERT INTO Messages (recipient, sender, messagetime, messagetext) VALUES (?, ?, ?, ?)';

    const [results] = await db.execute(query, 
        [recipient, sender, currentTime, message]);

    connection.release();



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

app.get('/clients', async (req, res) => {
    if(req.user){
        const connection = await db.getConnection();
        const [results] = await db.query(`SELECT * FROM Users WHERE username = '${req.user.username}';`)
        const [userlist] = await db.query(`SELECT * FROM Users;`);
        connection.release();
        const user = {
            name : results[0].username,
            phone : results[0].phoneNumber,
            age : results[0].age,
            id : results[0].id,
            sport : results[0].sport
        };

        console.log(userlist);

        res.render('clients', {user: user, clients: userlist});
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

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
})

app.use('/auth', authRoute);

app.listen(3000)

