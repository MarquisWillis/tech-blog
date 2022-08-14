const router = require('express').Router();
const { User } = require('../../models');

// route for creating an account
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        require.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
        })
    }
    catch (err) {
        res.status(400).json(err);
    }
});

// route for handling login
router.post('/login', async (req, res) => {
    try {
        // checks if username is valid
        const userData = await User.findOne({ where: { username: req.body.username } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        // checks if password is valid
        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        // initializes and saves cookie session once login is successful
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'Login successful' });
        });
    }
    catch (err) {
        res.status(400).json(err);
    }
});

// handles logout process
router.post('/logout', (req, res) => {
    if (require.session.logged_in) {
        require.session.destroy(() => {
            res.status(204).end();
        }) 
    } else {
        res.status(404).end();
    }
});

module.exports = router;