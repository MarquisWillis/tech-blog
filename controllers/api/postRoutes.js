const router = require('express').Router();
const { Post } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const postData = await Post.create(req.body);

        require.session.save(() => {
            req.session.post_id = postData.id;
            req.session.logged_in = true;
        });
        res.status(201).json(postData);
    }
    catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const postData = await Post.update(
            {
                title: req.body.title,
                entry: req.body.entry
            },
            {
                where: {
                    id: req.params.id
                } 
            }
        );

        require.session.save(() => {
            req.session.post_id = postData.id;
            req.session.logged_in = true;
        });
        res.status(201).json(postData);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async () => {
    try{
        const deletedPostData = await Post.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(201).json(deletedPostData);
    }
    catch (err) {
        res.status(500).json(err);
    } 
})

module.exports = router;