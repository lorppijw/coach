const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
require("dotenv").config();

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
//create connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.pass,
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
        } else {
            console.log(err)
            // Handle other errors here
        }
        }
        res.status(201).send()
    } catch (err){
        console.log(err);
        res.status(500).send()
    }
})


app.post('/users/login', async (req, res) => {

    let passwd = "";
    let success = false;
    await db.promise().query(`SELECT * FROM Users WHERE username = '${req.body.username}';`)
    .then(async resp => {
        salted = resp[0][0].passwd

        const user = {
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

app.listen(3000)

