const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const local = require('./strategies/local')
const store = new session.MemoryStore();
const authRoute = require('./routes/auth')

app.use(session({
    secret: 'abcd',
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
    store
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


app.post('/usersb', (req, res) => {
    let passwd = "";

    let sql = `SELECT passwd FROM Users WHERE username = '${req.body.username}';`
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        passwd = result[0].passwd
        res.status(201);
    })
})

app.post('/register', async (req, res) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.passwd, 10)
        const connection = await db.getConnection();
        const query = 'INSERT INTO users (username, passwd, email, phoneNumber, age, sport) VALUES (?, ?, ?, ?, ?, ?)';
        try {
        const [results] = await db.execute(query, [req.body.username, hashedPassword, req.body.email, req.body.phoneNumber, req.body.age, req.body.sport]);
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


app.post('/users/login', async (req, res) => {

    let passwd = "";
    let success = false;
    await db.query(`SELECT * FROM Users WHERE username = '${req.body.username}';`)
    .then(async resp => {
        salted = resp[0][0].passwd

        const user = {
        name : resp[0][0].username,
        phone : resp[0][0].phoneNumber,
        age : resp[0][0].age,
        id : resp[0][0].id,
        sport : resp[0][0].sport
        }

        try {
            if(await bcrypt.compare(req.body.passwd, salted)) {
                res.render('profile', {user: user})
            } else {
                res.status(403).send('Login failed')
            }
        } catch {
            res.status(500).send("ok")
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Login failed: user not found')
    })

})

app.get('/', async (req, res) => {
    if(req.user){
        const connection = await db.getConnection();
        const [results] = await db.query(`SELECT * FROM Users WHERE username = '${req.user.username}';`)
        res.status(200).send(results)
    } else {
        res.status(403).send('not authenticated')
    }
  

})

app.use('/auth', authRoute);

app.listen(3000)

