const Products  = require('../models/products.js')



 class ProductContr{
    constructor(){};

    // Get Methods
    static async GetProducts(req, res){
        try {
            const {id} = req.params;
            const {search, page} = req.query;
            if(id){
                const findProduct = await Products.findById(id);
                if(findProduct == null){
                    throw new Error(`Maxsulot topilmadi`)
                }
                if(findProduct.type_of!= 'product'){
                    throw new Error(`Maxsulot topilmadi`)
                }
                res.send({
                    status : 200,
                    message : 'Maxsulot malumotlari',
                    success : true,
                    data : findProduct
                })
            }else if(search){
                const keyword = search ? {
                    $or : [
                        {title : {$regex : search, $options : "i"}},
                        {company : {$regex : search, $options : "i"}},
                        {category : {$regex : search, $options : "i"}},
                    ]
                } : {}
                let searchResult = await Products.find(keyword)
                    searchResult = searchResult.filter(el=>el.type_of == 'product')
                res.send({
                    status : 200,
                    message : "Topilgan maxsulotlar",
                    success : true,
                    data : searchResult
                })
            }else{
                const pages = parseInt(page) || 1;
                const limit = 6;
                const totalProducts = await Products.countDocuments({type_of : 'product'})
                const totalPages = Math.ceil(totalProducts / limit);
                const data = await Products.find({type_of : 'product'}).skip((pages - 1) * limit).limit(limit).sort({createdAt : -1})

                res.send({
                    status : 200,
                    message : "Maxsulotlar",
                    success : true,
                    data,
                    count : (await Products.find({type_of : "product"})).length,
                    totalPages
                })
            }
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    };


    static async GetEquipments(req, res){
        try {
            const {id} = req.params;
            const {search, page} = req.query;
            if(id){
                const findProduct = await Products.findById(id);
                if(findProduct == null){
                    throw new Error(`Jihoz topilmadi`)
                }
                if(findProduct.type_of!= 'equipment'){
                    throw new Error(`Jihoz topilmadi`)
                }
                res.send({
                    status : 200,
                    message : 'Jihoz malumotlari',
                    success : true,
                    data : findProduct
                })
            }else if(search){
                const keyword = search ? {
                    $or : [
                        {title : {$regex : search, $options : "i"}},
                        {company : {$regex : search, $options : "i"}},
                        {category : {$regex : search, $options : "i"}},
                    ]
                } : {}
                let searchResult = await Products.find(keyword)
                    searchResult = searchResult.filter(el=>el.type_of == 'equipment')
                res.send({
                    status : 200,
                    message : "Topilgan jihozlar",
                    success : true,
                    data : searchResult
                })
            }else{
                const pages = parseInt(page) || 1;
                const limit = 6;
                const totalProducts = await Products.countDocuments({type_of : 'equipment'})
                const totalPages = Math.ceil(totalProducts / limit);
                const data = await Products.find({type_of : 'equipment'}).skip((pages - 1) * limit).limit(limit).sort({createdAt : -1})

                res.send({
                    status : 200,
                    message : "Jihozlar",
                    success : true,
                    data,
                    count : (await Products.find({type_of : "equipment"})).length,
                    totalPages
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




// Post Methods

static async AddProduct(req, res){
    try {
        const {title, company, category, img, count, desc, price} = req.body;
        if(!title || !company  || !category || !img || !count || !desc || !price){
            throw new Error(`Barcha ma'lumotlarni to'ldiring`)
        }
        const newProduct = await  Products.create({title, company, type_of : "product", category, img, count, desc, price})
        res.send({
            status : 201,
            message : `Maxsulot muvofaqqiyatli qo'shildi`,
            success : true,
            data : newProduct
        })
    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
}


static async AddEquipment(req, res){
    try {
        const {title, company, category, img, count, desc, price} = req.body;
        if(!title || !company  || !category || !img || !count || !desc || !price){
            throw new Error(`Barcha ma'lumotlarni to'ldiring`)
        }
        const newProduct = await Products.create({title, company, type_of : "equipment", category, img, count, desc, price})
        res.send({
            status : 201,
            message : `Jihoz muvofaqqiyatli qo'shildi`,
            success : true,
            data : newProduct
        })
    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
}

static async EditProduct(req, res){
    try {
        const {id} = req.params;
        const findProduct = await Products.findById(id);
        if(findProduct == null){
            throw new Error(`Topilmadi`)
        }
        const {title, company, category, img, count, desc, price} = req.body;
        if(!title && !company && !category && !img && !count && !desc && !price){
            throw new Error(`Malumot yubormadingiz hech qanday!`)
        }
        const editedProduct = await Products.findByIdAndUpdate(id, {title, company, category, img, count, desc, price}, {new : true});
        res.send({
            status : 200,
            message : "Muvofaqqiyatli o'zgartirildi!",
            success : true,
            data : editedProduct
        }) 
    } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
    }
}



static async DeleteProduct(req, res){
    try {
        const {id} = req.params;
        const findProduct = await Products.findById(id);
        if(findProduct == null){
            throw new Error(`Topilmadi`)
        }
        const deletedProduct = await Products.findByIdAndDelete(id);
        res.send({
            status : 200,
            message : "Muvofaqqiyatli o'chirildi",
            success : true,
            data : deletedProduct
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

module.exports = {ProductContr}