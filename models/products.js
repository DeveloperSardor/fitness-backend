const { model, Schema, Types }  = require("mongoose");


const ProductSchema = new Schema({
title : {
    type : String,
    required : true
},
company : {
    type : String,
    required : true
},
type_of : {
type : String,
enum : ['product', 'equipment'],
required : true
},
category : {
    type : String,
    required : true
},
img : {
    type : String,
    required : true
},
count : {
    type : Number,
    required : true
},
desc : {
type : String
},
price : {
    type : Number,
    required : true
}
}, {
    timestamps : true
})


ProductSchema.pre('save', function(next) {

   if(this.count === 0){
    this.remove()
   }
    next();
  });



module.exports = model('Products', ProductSchema)