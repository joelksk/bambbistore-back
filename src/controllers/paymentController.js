import mercadopago from '../config/mercadopago.js';
import { Preference } from 'mercadopago';
import dotenv from 'dotenv'
dotenv.config()


export const createPayment = async (req, res) => {
    try {
        const preferenceItems = req.body.map((item) => ({
                title: item.title,
                quantity: Number(item.quantity),
                unit_price: Number(item.price),
                currency_id: 'ARS'
        }));

        // Crea instancia de preferencia
        const preference = new Preference(mercadopago);

        const result = await preference.create({
            body: {
                items: preferenceItems,
                back_urls: {
                    success: `https://bambbistore.onrender.com/payment-status`, // redirige al finalizar exitosamente
                    failure: `https://bambbistore.onrender.com/payment-status`, // redirige si falla
                    pending: `https://bambbistore.onrender.com/payment-status`, // redirige si queda pendiente (por ejemplo, pago en efectivo)
                    },
                    auto_return: 'approved' // hace que se redirija automáticamente si el pago fue aprobado
                },
            },
        );

        res.status(200).json({ id: result.id, init_point: result.init_point });

    } catch (error) {
        console.error('Error al crear la preferencia de pago:', error);
        console.log(req.body)
        res.status(500).json({ error: 'Error al crear la preferencia de pago', details: error.message });
    }
};
