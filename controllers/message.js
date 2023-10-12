const Messages = require('../models/messages');
const { JWT } = require('../utils/jwt');
const Users  = require('../models/users')
const Chats = require('../models/chats')

class MessagesContr{

    static async AddMessage(req, res){
        const {token} = req.headers;
        const {id} = JWT.VERIFY(token);
        try {
            const {chat, message, file, receiver} =req.body;
            if( !message ){
                throw new Error(`Please fill all required fields`)
            }
            if(!chat && receiver){
                const newConversation = await Chats.create({members : [id, receiver]});
                const newMessage =await Messages.create({chat : (await newConversation)._id, sender, message, file});
                return res.send({
                    status : 201,
                    message : 'ok',
                    success : true,
                    data : newMessage
                })
            }
            const newMessage = await Messages.create({chat, sender : id, message, file});
            res.send({
                status : 201,
                message : `Xabar qo'shildi`,
                success : true,
                data : newMessage
            })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }


    static async GetMyMessages(req, res){
        try {
            const {chat} = req.params;
            if(!chat) {
                throw new Error(`Conversation Id is required!`)
            }
            const messages = await Messages.find({chat});
            const messageUserData = Promise.all(messages.map(async (message)=>{
                const user = await Users.findById(message.sender);
                return {user : {_id : user._id, img : user.img, firstname : user.firstname, lastname : user.lastname, gmail : user.gmail, role : user.role, phone : user.phone}, message : message.message}
            }))
            res.send({
                status : 200,
                message : `Ok`,
                success : true,
                data : await messageUserData
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



module.exports = {MessagesContr}