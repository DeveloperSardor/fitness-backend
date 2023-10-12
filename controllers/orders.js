const Orders  = require('../models/orders.js')
const { JWT }  = require('../utils/jwt.js');
const Products = require('../models/products.js')


 class OrderContr{
    constructor(){};

    // Get Methods
   
    static async AllOrdersViewAdmin(req, res){
        try {
            
            const OrdersResponse = await Orders.find({isReached : false}).populate('user').populate('products.product')

            res.send({
                status : 200,
                message : `Buyurtmalarim`,
                success : true,
                data : OrdersResponse,
              
            })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }

  static async MyOrders(req, res){
    try {
        const {token} = req.headers;
        const userId = JWT.VERIFY(token).id;
        const {page} = req.query;
        const pages = parseInt(page) || 1;
        const limit = 6;
        const totalProducts = await Orders.countDocuments({user : userId})
        const totalPages = Math.ceil(totalProducts / limit);
        const data = await Orders.find({user : userId}).skip((pages - 1) * limit).limit(limit).populate('products.product')
        res.send({
            status : 200,
            message : `Mening buyurtmalarim`,
            success : true,
            data,
            count : (await Orders.find({user : userId})).length,
            totalPages
        })
    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
  }


//   Post Methods
    static async OrderProduct(req,res){
        try {
            const {token} = req.headers;
            const {id} = JWT.VERIFY(token);
            const {products, totalSum} = req.body;
            const productsData = [];
            for (const productData of products) {
              const { product, count } = productData;
              const existingProduct = await Products.findById(product);
              if (!existingProduct) {
                throw new Error(`Mahsulot topilmadi: ${product}`);
              }
              if (existingProduct.count ==0) {
                throw new Error(`Mahsulot miqdori yetarli emas: ${existingProduct.title}`);
              }
              productsData.push({ product, count });
            }


            const order = new Orders({ user : id, products: productsData, totalSum });
            await order.save();


            for (const productData of productsData) {
                const { product, count } = productData;
                const existingProduct = await Products.findById(product);
                existingProduct.count -= count;
                await existingProduct.save();
              }

              res.send({
                status : 201,
                message : "Buyurtma movofaqqiyatli amalga oshirildi, tez orada buyurtmangiz yetkazib beriladi!",
                success : true,
                data : order
              })
            
            
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }




// Put Methods
static async isReachedChange(req, res){
    try {
        const {id} = req.params;
        const findOrder  = await Orders.findById(id);
        if(findOrder == null){
            throw new Error(`Buyurtma topilmadi`)
        }
        const changed = await Orders.findByIdAndUpdate(id, {isReached : !findOrder.isReached}, {new : true})
        res.send({
            status : 200,
            message : `O'zgardi`,
            success : true,
            data : changed
        })
    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
}


static async DeleteOrder(req, res){
    try {
        const {token} = req.headers;
        const userId = JWT.VERIFY(token).id;
        const {id} = req.params;
        const findOrder  = await Orders.findById(id);
        
        if(findOrder == null){
            throw new Error(`Buyurtma topilmadi`)
        }
    if(findOrder.user != userId){
        throw new Error(`Faqat o'zingizni buyurtmangizni o'chira olasiz`)
    }
        const deletedOrder = await Orders.findByIdAndDelete(id);
        res.send({
            status : 200,
            message : `Muvofaqqiyatli o'chirildi`,
            success : true,
            data : deletedOrder
        })
    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
}




static async deletedProductFromOrder(req, res){
    try {
        const {token} = req.headers;
        const {id} = JWT.VERIFY(token);
        const { orderId, productId } = req.body;
        // Buyurtmani tekshirish
        const existingOrder = await Orders.findById(orderId);
        if (existingOrder == null) {
         throw new Error('Buyurtma topilmadi');
        }
        if(existingOrder.user != id){
            throw new Error(`Faqat o'zingiznin buyurtmangizdai maxsulotlarni o'chira olasiz!`)
        }

        const productIndex = existingOrder.products.findIndex(
            (product) => product.product.toString() === productId
          );

          if (productIndex === -1) {
           throw new Error('Mahsulot topilmadi');
          }

          const prd = existingOrder.products[productIndex];
          if(prd.count === 0){
            existingOrder.products.splice(productIndex, 1)
            await existingOrder.save()
          }
      
          const removedProduct = existingOrder.products.splice(productIndex, 1)[0];
          await existingOrder.save();


  res.send({
    status : 200,
    message : `Muvofaqqiyatli o'chirildi`,
    success : true,
    data : removedProduct
  })

    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
}


}






module.exports = {OrderContr}