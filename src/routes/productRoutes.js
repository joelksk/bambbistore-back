import express from 'express';
import {createProduct, deleteProduct, getAllProducts, getProductById, updateProduct} from '../controllers/productController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
const router = express.Router();

//TODO:volver a  agregar el auth middleware a las rutas necesarias

//GET /api/products
router.get('/', getAllProducts);
//POST /api/products
router.post('/', createProduct);
//GET /api/products/:id
router.get('/:id', getProductById)
//PUT /api/products/:id
router.put('/:id', updateProduct);
//DELETE /api/products/:id
router.delete('/:id',  deleteProduct)

export default router;
