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

async function checkPassword(plain, salted, success){
    try {
        if(await bcrypt.compare(plain, salted)) {
            console.log('Success')
            success = true;
        } else {
            console.log('Not allowed')
        }
    } catch {
        res.status(500).send()
    }
}

app.post('/users/login', (req, res) => {
    // const user = users.find(user => user.username == req.body.username)

    let passwd = "";
    let success = false;
    let sql = `SELECT passwd FROM Users WHERE username = '${req.body.username}';`
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        passwd = result[0].passwd
        res.status(201);
        checkPassword(req.body.passwd, passwd, success)
    })
    
    console.log(success)

    // if(user == null) {
    //     return res.status(400).send('Cannot find user')
    // }
})

app.listen(3000)

