const { model, Schema, Types }  = require("mongoose");

const PaymentSchema = new Schema({
order_id : {
    type : Types,
    ref : "Orders"
},
payment_type : {
    type : String,
    enum : ['card', 'stock']
}
}, {
    timestamps : true
})


export default model('Payments', PaymentSchema)