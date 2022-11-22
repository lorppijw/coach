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
    // const user = users.find(user => user.username == req.body.username)

    let passwd = "";

    let sql = `SELECT passwd FROM Users WHERE username = '${req.body.username}';`
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result)
        passwd = result[0].passwd
        console.log(passwd)
        res.status(201);
    })

    // if(user == null) {
    //     return res.status(400).send('Cannot find user')
    // }
    try {
        //wait for sql query to finish before...
        console.log("req.passwd = " + req.body.passwd)
        console.log("passwd = "+ passwd)
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

