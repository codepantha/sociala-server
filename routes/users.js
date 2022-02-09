const router = require('express').Router();

router.get('/', (req, res) => res.send('the users route'))

module.exports = router;