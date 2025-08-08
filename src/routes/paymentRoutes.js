import express from 'express';
import { createPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Ruta para crear un pago
router.post('/', createPayment);

export default router;