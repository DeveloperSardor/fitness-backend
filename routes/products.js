const { Router } =  require("express");
const { checkAdmin, checkToken } =  require("../middlewares/index.js");
const { ProductContr } =  require("../controllers/products.js");

const router = Router();


// Get Methods
router.get(`/products`, checkToken, ProductContr.GetProducts)
router.get(`/products/:id`, checkToken, ProductContr.GetProducts)


router.get(`/equipments`, checkToken, ProductContr.GetEquipments)
router.get(`/equipments/:id`, checkToken, ProductContr.GetEquipments)


// Post Methods

router.post(`/add-product`, checkAdmin, ProductContr.AddProduct);

router.post(`/add-equipment`, checkAdmin, ProductContr.AddEquipment);


// Put Methods

router.put(`/edit-product/:id`, checkAdmin, ProductContr.EditProduct);

// Delete Methods

router.delete(`/delete-product/:id`, checkAdmin, ProductContr.DeleteProduct)

module.exports = router;