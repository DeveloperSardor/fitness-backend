const Users = require('../models/users.js')
const { JWT } = require('../utils/jwt.js');

 const checkToken = async(req, res, next)=>{
    try {
        const {token} = req.headers;
        if(!token){
            throw new Error(`Token yuborishingiz kerak!`)
        }
        const {id} = JWT.VERIFY(token);
        const findUser = await Users.findById(id);
        if(findUser == null){
            throw new Error(`Foydalanuvchi topilmadi!`)
        }
            next()  
        
    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
}


 const checkAdmin = async(req, res, next)=>{
    try {
        const {token} = req.headers;
        if(!token){
            throw new Error(`Token yuborishingiz kerak!`)
        }
        const {id} = JWT.VERIFY(token);
        const findUser = await Users.findById(id);
        if(findUser == null){
            throw new Error(`Foydalanuvchi topilmadi!`)
        }
        if(findUser.role!= 'admin'){
            throw new Error(`Siz admin emassiz!`)
        }
            next()
    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
}



module.exports = {checkAdmin, checkToken}
 