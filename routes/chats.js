const {Router} = require('express');
const {checkToken} = require('../middlewares')
const {ChatContr} = require('../controllers/chat')

const router = Router();


router.post('/', checkToken, ChatContr.createChat);
router.post('/connect-admin', checkToken, ChatContr.connectWithAdmin);
router.get('/', checkToken, ChatContr.GetChat);



module.exports = router