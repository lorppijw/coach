const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql')

app.use(express.json())

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

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.passwd, 10)
        const user = { username: req.body.username, passwd: hashedPassword, 
        email: req.body.email, phoneNumber: req.body.phoneNumber,
        age: req.body.age, sport: req.body.sport}
        res.status(201).send()
        users.push(user)
        console.log(user)
    } catch {
        res.status(500).send()
    }
})

app.post('/users/login', async (req, res) => {
    // const user = users.find(user => user.username == req.body.username)

    let passwd = "";

    let sql = `SELECT passwd FROM Users WHERE username = '${req.body.username}';`
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        passwd = result[0].passwd
        res.status(201);
    })

    // if(user == null) {
    //     return res.status(400).send('Cannot find user')
    // }
    try {
        //fix
        if(await bcrypt.compare(req.body.passwd, passwd)) {
            res.send('Success')
        } else {
            res.send('Not allowed')
        }
    } catch {
        res.status(500).send()
    }
})

app.listen(3000)

