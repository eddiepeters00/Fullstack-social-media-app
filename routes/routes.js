const express = require('express');
const router = express.Router();
const db = require('./../db_connection');
const authMiddleware = require('./../middlewares/auth');


router.get('/', (req, res) => {
    const data = {
        title: "Welcome",
        message: req.flash('message')
    }
    console.log(data.message)
    res.render('index', data)
})

router.get('/dashboard', authMiddleware, (req, res) => {
    if (req.isAuthenticated) {
        // If the user is authenticated
        const username = req.session.username;
        const data = {
            name: username,
            style: "color: red;",
            message: req.flash('message')
        }
        res.render('dashboard', data)
    } else {
        res.redirect('/login');
    }
})

router.get('/logout', (req, res) => {
    if (req.session.authenticated && req.session.username) {
        req.session.authenticated = false;
        req.session.username = null;
        req.flash('message', 'You are now logged out.');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
})

router.get('/login', (req, res) => {
    const data = {
        message: req.flash('message')
    }
    res.render('login', data);
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    const values = [email, password];
    db.query(sql, values, function (error, results, fields) {
        if (error) throw error;

        if(results.length > 0){
            req.session.username = results[0].name;
            req.session.authenticated = true;
            req.flash('message', 'You are now logged in.');
            res.redirect('/dashboard');
        }else{
            req.flash('message', 'Please enter the correct email or password');
            res.redirect('/login');
        }

    });

})

// SIGN UP
router.get('/signup', (req, res) => {
    res.render('signup')
})

// Route for creating a new user
router.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    const user = { name, email, password };

    // Insert new user into MySQL database
    db.query('INSERT INTO users SET ?', user, (err, results) => {
        if (err) {
            console.error('Error creating new user: ', err);
            res.status(500).send('Error creating new user');
            return;
        }
        console.log('New user created with id: ', results.insertId);
        req.session.username = user.name;
        req.session.authenticated = true;
        res.redirect('/dashboard');
    });
});

// PROFILE
router.get('/profile', (req, res) =>{
    console.log(req.session);
    const username = req.session.username;
    const values = [username];

    db.query(`SELECT * FROM users WHERE name = ?`, values, (err, results) =>{
        if (err) {
            console.error('Error finding user: ', err);
            res.status(500).send('Error finding user');
            return;
        }
        console.log(results[0]);
        const data = {
            username: results[0].name,
            email: results[0].email
        }
        res.render('profile', data);
    })
});



module.exports = router;