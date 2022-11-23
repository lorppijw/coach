const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql2')

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

    let passwd = "";
    let success = false;
    await db.promise().query(`SELECT * FROM Users WHERE username = '${req.body.username}';`)
    .then(async resp => {
        salted = resp[0][0].passwd
        phone = resp[0][0].phoneNumber
        age = resp[0][0].age
        id = resp[0][0].id
        sport = resp[0][0].sport
        try {
            if(await bcrypt.compare(req.body.passwd, salted)) {
                res.status(201).send('Login successful \nUserdata:\n' + phone + '\n' + 
                age + '\n' + id + '\n' + sport )
            } else {
                res.status(403).send('Login failed')
            }
        } catch {
            res.status(500).send()
        }
    }).catch(console.log)

})

app.listen(3000)

