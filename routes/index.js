const { Router }  = require("express");
const users  = require("./user.js");
const orders  = require("./orders.js");
const products = require('./products.js')
const messages = require('./messages.js')
const chats = require('./chats.js')
const Products = require('../models/products.js')
const Users = require('../models/users.js')

const router = Router();

router.use(`/users`, users);
router.use(`/products`, products)
router.use(`/orders`, orders)
router.use('/messages', messages)
router.use('/chats', chats)

router.get('/counts', async(req, res)=>{
    const products = await Products.find({type_of:"product"})
    const equipments = await Products.find({type_of:"equipment"})
    const customer = await Users.find({role : "customer"})
    const teacher = await Users.find({role : "teacher"})
    res.send({
        status : 200,
        message : "ok",
        success : true,
        data : {
            products : products.length,
            customer : customer.length,
            equipments : equipments.length,
            teachers : teacher.length
        }
    })
})   


module.exports =  router;