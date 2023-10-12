const Router = require('express');
const { checkAdmin, checkToken } = require('../middlewares');
const { OrderContr } = require('../controllers/orders');



const router = Router();


router.get(`/all-orders`, checkAdmin, OrderContr.AllOrdersViewAdmin);

router.get('/my-orders', checkToken, OrderContr.MyOrders);

router.post(`/add-order`, checkToken, OrderContr.OrderProduct);

router.put(`/isReached/:id`, checkAdmin, OrderContr.isReachedChange);

router.put(`/delete-product`, checkToken, OrderContr.deletedProductFromOrder)

router.delete(`/order`, checkToken, OrderContr.DeleteOrder)



module.exports = router;
