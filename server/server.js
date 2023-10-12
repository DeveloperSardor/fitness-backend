const express  = require('express');
require('dotenv').config()
const connectDb = require('../utils/connection-db.js')
const api  = require('../routes/index.js')
const cors  = require('cors')
const Users = require('../models/users.js');
const Chats = require('../models/chats.js')
const Messages = require('../models/messages.js')


  
const app = express();
app.use(express.json());
app.use(cors('*'))
const PORT = process.env.PORT || 3000;

connectDb()


app.use(`/api`, api)



app.use('*', (req, res)=>{
    res.send({
        status : 404,
        message : "Not Found URL",
        success : false
    })
});






const server = app.listen(PORT, console.log(`Server running on port ${PORT}`)) 

const io = require('socket.io')(server, {
pingTimeOut : 60000,
cors : {
    origin : ["http://localhost:5173", "http://localhost:5174"]
}
})

// const admins = [];

let users = [];


io.on('connection', socket =>{
    console.log(`User connected`, socket.id);
  socket.on('addUser', userId =>{
    const isUserExists = users.find(user=>user.userId == userId);
    if(!isUserExists){
        const user = {userId, socketId : socket.id};
        users.push(user);
        io.emit('getUsers', users);
    }
  });




socket.on('sendMessage', async ({ sender, receiver, message, chat }) => { 
  const receivers = users.find(user => user.userId === receiver);
   const senders = users.find(user => user.userId === sender);
  const senderUser = await Users.findById(sender);

  if (receivers) {
    io.to(receivers?.socketId).to(senders?.socketId).emit('getMessages', {
      sender,
      message,
      chat,
      receiver,
      user: {
        _id: senderUser._id,
        firstname: senderUser.firstname,
        lastname: senderUser.lastname,
        gmail: senderUser.gmail,
        phone: senderUser.phone,
        gender: senderUser.gender,
        days: senderUser.days,
        teacher: senderUser.teacher,
        category: senderUser.category,
        service_price: senderUser.service_price,
        info: senderUser.info,
        img: senderUser.img
      }
    });
  }
   else{
    io.to(senders?.socketId).emit('getMessages', {
        sender,
        message,
        chat, 
        receiver,
        user : {
            _id: senderUser?._id,
            firstname: senderUser?.firstname,
            lastname: senderUser?.lastname,
            gmail: senderUser?.gmail,
            phone: senderUser?.phone,
            gender: senderUser?.gender,
            days: senderUser?.days,
            teacher: senderUser?.teacher,
            category: senderUser?.category,
            service_price: senderUser?.service_price,
            info: senderUser?.info,
            img: senderUser?.img }
    })
  }


//   else {
//     io.to(senders.socketId).emit('getMessages', {
//       sender,
//       message,
//       chat,
//       receiver,
//       user: {
//         _id: senderUser._id,
//         firstname: senderUser.firstname,
//         lastname: senderUser.lastname,
//         gmail: senderUser.gmail,
//         phone: senderUser.phone,
//         gender: senderUser.gender,
//         days: senderUser.days,
//         teacher: senderUser.teacher,
//         category: senderUser.category,
//         service_price: senderUser.service_price,
//         info: senderUser.info,
//         img: senderUser.img
//       }
//     });
//   }
});

socket.on('disconnect', ()=>{
    users = users.filter(user => user.socketId != socket.id)
    io.emit('getUsers', users)
})

})



