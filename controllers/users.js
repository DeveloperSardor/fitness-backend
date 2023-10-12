const Users = require('../models/users.js')
const { JWT } = require('../utils/jwt.js');
const sendMail = require('../utils/nodemailer.js');
const Chats = require('../models/chats.js')

const confirmCode = Math.floor(Math.random() * 9000 + 1000);

 class UserContr{
    constructor(){}



    // Post Methids
    // Authorizations
    static async AddCustomer (req, res){
        try {
            const {firstname, lastname, gmail, phone, img, birth_date, days, gender, teacher, service_price, info} = req.body;
            if(!firstname || !lastname || !gmail || !phone  || !birth_date || !days || !teacher || !service_price || !gender){
                throw new Error(`Barcha malumotlarni to'ldiring!`)
            }
            const newCustomer = await Users.create({firstname, lastname, role : "customer" ,gmail,info, phone, img, birth_date, days, gender, teacher, service_price})
            // await Chats.create({user : newCustomer._id})
            res.send({
                status : 201,
                message : `Mijoz muvofaqqiyatli qo'shildi`,
                success : true,
                data : newCustomer
            })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }




    static async AddTeacher (req, res){
        try {
            const {firstname, lastname, gmail, category, gender, phone, img, info, birth_date, days} = req.body;
            if(!firstname || !lastname || !gmail || !phone  || !category || !gender  || !birth_date || !days  ){
                throw new Error(`Barcha malumotlarni to'ldiring!`)
            }
            const newTeacher = await Users.create({firstname, lastname, category, role : "teacher" ,gmail,info, gender, phone, img, birth_date, days})
            res.send({
                status : 201,
                message : `Ustoz muvofaqqiyatli qo'shildi`,
                success : true,
                data : newTeacher
            })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }

    static async Login(req, res){
      try {
        const {gmail, password} = req.body;
        const findUser = await Users.findOne({gmail, phone : password});
        if(findUser == null){
            throw new Error(`Foydalanuvchi topilmadi!`)
        }
          await sendMail(gmail, confirmCode)
          res.send({
            status : 200,
            success : true,
            message : "Gmailingizga tasdiqlash kodi yubordik, kodni kiriting!",
          })
      } catch (error) {
        res.send({
            status : 400,
            message : error.message,
            success : false
        })
      }
    }
    static async LoginAdmin(req, res){
        try {
          const {gmail, password} = req.body;
          const findUser = await Users.findOne({gmail, phone : password});
          if(findUser?.role != 'admin'){
            throw new Error(`Siz admin emassiz!`)
          }
       
          if(findUser == null){
              throw new Error(`Foydalanuvchi topilmadi!`)
          }
            await sendMail(gmail, confirmCode)
            res.send({
              status : 200,
              success : true,
              message : "Gmailingizga tasdiqlash kodi yubordik, kodni kiriting!",
            })
        } catch (error) {
          res.send({
              status : 400,
              message : error.message,
              success : false
          })
        }
      }
    

    static async GmailVerification(req, res){
        try {
            
            const {pass, gmail} = req.body;
            const findByGmail = await Users.findOne({gmail})
            if(!pass){
                throw new Error(`You have to send pasword!`)
            }
            if(pass == confirmCode){
                res.send({
                    status : 200,
                    message : "Muvofaqiyatli kirdingiz",
                    success : true,
                    token : JWT.SIGN(findByGmail._id),
                    data : findByGmail
                })
            }else{
                throw new Error(`Kodni xato kiritdingiz`)
            }
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }


    // Get Methods

    static async GetTeachers(req, res){
        try {
            const {page} = req.query;
            const {id} = req.params;
            const {search} = req.query;
            if(id){
                const findTeacher = await Users.findById(id);
               
                res.send({
                    status : 200,
                    message : 'Ustoz malumotlari',
                    success : true,
                    data : findTeacher
                })
            }else if(search){
                const keyword = req.query.search
                ? {
                    $or: [
                      { firstname: { $regex: req.query.search, $options: "i" } },
                      { lastname: { $regex: req.query.search, $options: "i" } },
                    ],
                  }
                : {};
                let searchResult = await Users.find(keyword);
               searchResult = searchResult.filter(el=>el.role=='teacher')
                res.send({
                    status : 200,
                    message : "Topilgan ustozlar",
                    success : true,
                    data : searchResult
                })
            }
            else{
                const pages = parseInt(page) || 1;
                const limit = 6;
                const totalProducts = await Users.countDocuments({role : 'teacher'})
                const totalPages = Math.ceil(totalProducts / limit);
                const data = await Users.find({role : "teacher"}).skip((page - 1) * limit).sort({createdAt : -1})
                .limit(limit)
            
                res.send({
                    status : 200,
                    message : "Ustozlar",
                    success : true,
                    data,
                    count : (await Users.find({role : "teacher"})).length,
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

    


    static async SearchTeacherOrCustomer(req, res){
        try {
            const {search} = req.query;
            const keyword = search ? {
                $or : [
                    {firstname : {$regex : search, $options : "i"}},
                    {lastname : {$regex : search, $options : "i"}},
                    {_id : {$regex : search, $options : "i"}},
                ]
            } : {}
            const searchResult = await Users.find(keyword).populate('teacher');
            res.send({
                status : 200,
                message : "Topilgan foydalanuvchilar",
                success : true,
                data : searchResult
            })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }

    static async GetCustomers(req, res){
        try {
            const {page, search} = req.query;
            const {id} = req.params;
            if(id){
                const findCustomer = await Users.findById(id).populate('teacher');
                if(findCustomer == null){
                    throw new Error(`Mijoz topilmadi`)
                }
                if(findCustomer.role!= 'customer'){
                    throw new Error(`Mijoz topilmadi`)
                }
                res.send({
                    status : 200,
                    message : 'Mijoz malumotlari',
                    success : true,
                    data : findCustomer
                })
            }else if(search){
                const keyword = search ? {
                    $or : [
                        {firstname : {$regex : search, $options : "i"}},
                        {lastname : {$regex : search, $options : "i"}},
                    ]
                } : {}
                let searchResult = await Users.find(keyword).populate('teacher');
                searchResult = searchResult?.filter(el=>el.role == 'customer')
                res.send({
                    status : 200,
                    message : "Topilgan mijozlar",
                    success : true,
                    data : searchResult
                })
            }else{
                const pages = parseInt(page) || 1;
                const limit = 6;
                const totalProducts = await Users.countDocuments({role : 'customer'})
                const totalPages = Math.ceil(totalProducts / limit);
                const data = await Users.find({role : "customer"}).skip((page - 1) * limit).sort({createdAt : -1})
                .limit(limit)
            
                res.send({
                    status : 200,
                    message : "Mijozlar",
                    success : true,
                    data,
                    count : (await Users.find({role : "customer"})).length,
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


    static async GetAllUsersForAdmin(req, res){
        try {
            const {token} = req.headers;
            const {id} = JWT.VERIFY(token);
            const users = await Users.find();
            res.send({
                status : 200,
                message : 'Ok',
                success : true,
                data : users.filter(el=>el._id != id)
            })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }


    static async EditUser(req, res){
        try {
            const {id} = req.params;
            const findUser = await Users.findById(id);
            if(findUser == null){
                throw new Error(`Foydalanuvchi topilmadi!`)
            }
            const {firstname, lastname, role, gmail, category, phone, gender, img, birth_date, days, teacher, service_price, info} = req.body;
            if(!firstname && !lastname &&  !role &&  !gmail && !category &&  !phone &&  !gender && !img &&  !birth_date &&  !days &&  !teacher && !service_price &&  !info){
                throw new Error(`Birorta malumot kiritganingiz yo'q`)
            }
            const editedUser = await Users.findByIdAndUpdate(id, {firstname,lastname, gender, category, role, gmail, phone, img, birth_date, days, teacher, service_price, info}, {new : true});
            res.send({
                status : 200,
                message : `Malumot muvofaqqiyatli o'zgartirildi`,
                success : true,
                data : editedUser
            })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    } 


    static async DeleteUser(req, res){
        try {
            const {id} = req.params;
            const findUser = await Users.findById(id);
            if(findUser == null){
                throw new Error(`Foydalanuvchi topilmadi!`)
            }
            const deletedUser = await Users.findByIdAndDelete(id);
            res.send({
                status : 200,
                message : "Muvofaqqiyatli o'chirildi",
                success : true,
                data : deletedUser
            })
        } catch (error) {
            res.send({
                status : 400,
                message : error.message,
                success : false
            })
        }
    }



    static async DeleteManyUser(req, res){
        try {
         const {ids} = req.body;
         const result = await Users.deleteMany({_id : {$in : ids}});
         res.send({
            status : 200,
            message : `Muvofaqqiyatli o'chirildi`,
            success : true,
            data : result
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


module.exports = {UserContr}