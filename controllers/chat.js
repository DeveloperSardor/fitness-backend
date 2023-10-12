const Chats = require('../models/chats');
const Users = require('../models/users')
const { JWT } = require('../utils/jwt');

class ChatContr{
    constructor(){}
    static async createChat(req, res){
        try {
            const {receiverId}  = req.body;
            const {token} = req.headers;
            const {id} = JWT.VERIFY(token);
             const newChat = await Chats.create({members : [receiverId, id]})
              res.send({
                status : 400,
                message : "Chat muvofaqqiyatli yaratildi",
                success : true, 
                data : newChat
              })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }

    static async connectWithAdmin(req, res){
        try {
            const findAdmin = await Users.findOne({role : "admin"})
            const {token} = req.headers;
            const {id} = JWT.VERIFY(token);
            const isExists = await Chats.findOne({members : [findAdmin._id, id]});
            if(!isExists){
            const newChat = await Chats.create({members : [findAdmin._id, id]})
            res.send({
                status : 201,
                message : "ok",
                success : true,
                data : newChat
            })
            }else{
                res.send({
                    status : 200,
                    message : "ok",
                    success : true,
                    data : isExists
                })
            }
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }


static async GetChat(req, res){
    try {  
        const {token} = req.headers;
        const {id} = JWT.VERIFY(token);
        const conversations = await Chats.find({members : {$in : [id]}}).sort({createdAt : -1});
        if(!conversations.length){
            const findUser = await Users.findById(id);
            if(findUser?.role != 'admin'){
                const findAdmin = await Users.findOne({role : "admin"})
                const newChat = await Chats.create({members : [findAdmin._id, id]})
            }
        }
        const conversationsUserData =Promise.all(conversations.map(async (converstion)=>{
            const receiverId = converstion.members.find((member)=> member != id);
            const user = await Users.findById(receiverId);
            return {user : {receiverId : user?._id, firstname : user?.firstname, img : user?.img, lastname : user?.lastname, gmail : user?.gmail, role : user?.role, phone : user?.phone}, conversationId : converstion?._id}
        }))
        res.send({
            status : 200,
            message : "Ok",
            success : true,
            data : await conversationsUserData
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


module.exports = {ChatContr}