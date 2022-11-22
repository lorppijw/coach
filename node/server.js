const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
    res.json(users)
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
    const user = users.find(user => user.username == req.body.username)
    if(user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.passwd, user.passwd)) {
            res.send('Success')
        } else {
            res.send('Not allowed')
        }
    } catch {
        res.status(500).send()
    }
})

app.listen(3000)

