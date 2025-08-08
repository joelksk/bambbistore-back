import express from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js'
const router = express.Router();

// TODO: agregar los middlewares donde corresponda

//POST /api/categories
router.post('/', createCategory);
//GET /api/categories
router.get('/', getAllCategories);
//PUT /api/categories/:id
router.put('/:id', authMiddleware, updateCategory);
//DELETE /api/categories/:id
router.delete('/:id', deleteCategory);

export default router;
