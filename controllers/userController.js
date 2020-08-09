const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};


exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};


exports.registerValidator = (req, res, next) => {

    body(['name', 'Name is required']).not().isEmpty();
    body(['email', 'Invalid email address']).normalizeEmail({ gmail_remove_dots: false }).isEmail();
    body(['password', 'Password is required']).not().isEmpty();
    body(['confirm-password', 'Confirm password is required']).not().isEmpty();
    body(['confirm-password', 'Password does not match']).equals(req.body.password);

    const errors = validationResult(req);

    if(errors) {
        req.flash('error', { errors: errors.array() });
        // req.flash('error', { errors: JSON.stringify(errors.array()) });

        res.render('register', {
            title: 'Register',
            body: req.body,
            flashes: req.flash()
        });
    }
    // next();
};