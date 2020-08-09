const mongoose      = require('mongoose');
const { promisify } = require('es6-promisify');

const User     = mongoose.model('User');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};


exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};


exports.registerValidator = (req, res, next) => {

    req.sanitizeBody('name');
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Invalid email address').isEmail();
    req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false,});
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm-password', 'Confirm password is required').notEmpty();
    req.checkBody('confirm-password', 'Password does not match').equals(req.body.password);

    // check(['name', 'Name is required']).not().isEmpty();
    // check(['email', 'Invalid email address']).normalizeEmail({ gmail_remove_dots: false }).isEmail();
    // check(['password', 'Password is required']).not().isEmpty();
    // check(['confirm-password', 'Confirm password is required']).not().isEmpty();
    // check(['confirm-password', 'Password does not match']).equals(req.body.password);

    const errors = req.validationErrors();

    if(errors) {
        req.flash('error', errors.map(err => err.msg));
        // req.flash('error', { errors: errors.array() });
        // req.flash('error', { errors: JSON.stringify(errors.array()) });

        res.render('register', {
            title: 'Register',
            body: req.body,
            flashes: req.flash()
        });

        return; // stop function from running
    }
    next(); // no errors, call next
};

exports.register = async(req, res, next) => {
    const user     = new User({ email: req.body.email, name: req.body.name });
    const register = promisify(User.register, User);

    await register(user, req.body.password);

    res.send('register works!');

    next(); // pass to authController.login()

    /* User.register(user, req.body.password, function(err, user) {

    }); */
};