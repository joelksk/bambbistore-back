import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

//POST /api/orders
router.post('/', createOrder);
//GET /api/orders //Agregar el middleware de auth
router.get('/',  getAllOrders);
//GET /api/orders/:id //Agregar el middleware de auth
router.get('/:id', getOrderById);
//PUT /api/orders/:id //Agregar el middleware de auth
router.put('/:id/status', updateOrderStatus);

export default router;
