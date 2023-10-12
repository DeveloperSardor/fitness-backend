const {Router} = require('express')
const {UserContr} = require('../controllers/users.js')
const { checkAdmin, checkToken }  = require("../middlewares/index.js");


const router = Router();


// Post Menthids
router.post(`/add-customer`, checkAdmin, UserContr.AddCustomer);

router.post('/add-teacher', checkAdmin, UserContr.AddTeacher)


// Authentication
router.post('/login', UserContr.Login)
router.post('/login-admin', UserContr.LoginAdmin)

router.post('/verification', UserContr.GmailVerification)


// Get Methods
router.get(`/teachers`, checkToken, UserContr.GetTeachers);
router.get(`/teachers/:id`, checkToken, UserContr.GetTeachers);

router.get(`/search`, checkToken, UserContr.SearchTeacherOrCustomer)

router.get(`/customers`, checkToken, UserContr.GetCustomers);
router.get(`/customers/:id`, checkToken, UserContr.GetCustomers);

router.get(`/users-foradmin`, checkAdmin, UserContr.GetAllUsersForAdmin)

  

// Put Methods

router.put(`/edit/:id`, checkAdmin, UserContr.EditUser);

// Delete Methods

router.delete(`/delete/:id`, checkAdmin, UserContr.DeleteUser)


router.put(`/delete-many`, checkAdmin, UserContr.DeleteManyUser)


module.exports =  router;