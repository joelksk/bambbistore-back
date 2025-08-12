import express from 'express';
import { createPayment, updateMpStatus } from '../controllers/paymentController.js';

const router = express.Router();

// Ruta para crear un pago
router.post('/', createPayment);
//Ruta para actualizar el estado de la orden
router.post('/webhook', updateMpStatus)

export default router;