const {Router} = require('express');
const { MessagesContr } = require('../controllers/message');
const { checkToken } = require('../middlewares');


const router = Router();

router.post('/', checkToken, MessagesContr.AddMessage)
router.get('/:chat', checkToken, MessagesContr.GetMyMessages)

module.exports = router;