const { model, Schema, Types }  = require("mongoose");



const UserSchema = new Schema({
firstname : {
    type : String,
    required : true
},
lastname : {
    type : String
},
role : {
    type : String,
    enum : ['admin', 'customer', 'teacher'],
    required : true
},
gmail : {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
},
phone : {
    type : String,
    unique : true,
    required : true
},
img : {
    type : String,
    default : 'https://avatars.mds.yandex.net/i?id=c455d760479e7b2aa0112f3a3fb5ed9df128c6a1-9065887-images-thumbs&n=13'
},
birth_date : {
    type : Date
},
days : {
    type : String,
    enum : ['toq', 'juft'],
    required : true,
    default : null
},
teacher : {
    type : Types.ObjectId,
    ref : "Users",
    default : null
},
service_price : {
    type : Number,
    default : null
},
active : {
    type : Boolean,
    default : false
},
category : {
type : String,
// enum : ['birinchi', 'ikkinchi', 'uchinchi', "to'rtinchi"],
default : null
},
gender : {
    type : String,
    union : ['erkak', 'ayol']
},
active_id : {
    type : String,
    default : null
},
info : {
    type : String,
    default : null
}
}, {
    timestamps : true
})


module.exports =  model('Users', UserSchema)