const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql2')
const bodyParser = require('body-parser')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
//create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'topikissa000',
    database: 'users'
});

//connect
db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('mysql connected');
})

const users = []

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

        let sql = `INSERT INTO users (username, passwd, email, phoneNumber, age, sport)
        VALUES (
            '${req.body.username}',
            '${hashedPassword}',
            '${req.body.email}',
            '${req.body.phoneNumber}',
            '${req.body.age}',
            '${req.body.sport}'
        )`
        let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.status(201);
    })
        

        res.status(201).send()
        users.push(user)
        console.log(user)
    } catch {
        res.status(500).send()
    }
})


app.post('/users/login', async (req, res) => {

    let passwd = "";
    let success = false;
    await db.promise().query(`SELECT * FROM Users WHERE username = '${req.body.username}';`)
    .then(async resp => {
        salted = resp[0][0].passwd

        let userInfo = {
        phone : resp[0][0].phoneNumber,
        age : resp[0][0].age,
        id : resp[0][0].id,
        sport : resp[0][0].sport
        }

        try {
            if(await bcrypt.compare(req.body.passwd, salted)) {
                //send user info as json object?
                res.set('Content-Type', 'text/html')
                res.send(Buffer.from(`<body style="text-align: center; margin="0";><h3>Tervetuloa ${req.body.username}<br>Tiedot </h3><p>Puhelinnumero: ${userInfo.phone}</p><br><p>Ikä: ${userInfo.age}</p></body>`))
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

