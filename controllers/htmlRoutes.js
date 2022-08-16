const router = require('express').Router();
const { User, Comment, Post } = require('../models');
const withAuth = require('../utils/auth');

// route for getting the homepage for user to read
router.get('/', async (req, res) => {
    try {
        // get all posts, join with user data
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        // serialize the post data so it can be read by template
        const posts = postData.map((post) => post.get({ plain: true }));

        //pass serialized data and session flag to template for homepage
        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try{
        // get single post by id and include User and attr name
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment
                }
            ]
        });

        // serialize data to enable template to read
        const post = postData.get({ plain: true });

        // pass serialized data and session flag to template for 
        res.render('dashboard', {
            ...post,
            logged_in: req.session.logged_in
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }]
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: true
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/homepage');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/homepage');
        return;
    }
    
    res.render('signup');
});

module.exports = router;