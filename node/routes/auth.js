const { Router } = require('express');
const passport = require('passport');

const router = Router();

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/');
});

module.exports = router;