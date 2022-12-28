const LocalStrategy = require('passport-local');
const passport = require('passport');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt')

require("dotenv").config();

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.PASS,
    database: 'users'
});

passport.serializeUser((user, done) => {
    done(null, user.username);
})

passport.deserializeUser(async (username, done) => {
    try {
        const connection = await db.getConnection();
        const [result] = await db.query(`SELECT * FROM Users WHERE username = '${username}';`)
        if(result[0]) {
            done(null, result[0]);
        }
    } catch (err) {
        done(err, null);
    }
})

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const connection = await db.getConnection();
            const [result] = await db.query(`SELECT * FROM Users WHERE username = '${username}';`)
            console.log(result);
            if(result[0].length === 0){
                done(null, false);
            } else {
                if(await bcrypt.compare(password, result[0].passwd)) {
                    done(null, result[0]);
                    console.log('successful')
                } else {
                    done(null, false);
                }
            }
        } catch (err) {
            done(err, false);
        }
    }
))