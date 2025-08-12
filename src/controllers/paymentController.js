import mercadopago from '../config/mercadopago.js';
import { Preference, Payment } from 'mercadopago';
import {restoreStockFromOrder} from './productController.js'
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import { sendEmail } from '../middlewares/nodemailerMiddleware.js';
dotenv.config();


export const createPayment = async (req, res) => {
    try {
        let order = req.body;

        const preferenceItems = order.items.map((item) => ({
                title: item.title,
                quantity: Number(item.quantity),
                unit_price: Number(item.price),
                currency_id: 'ARS'
        }));

        // Crea instancia de preferencia
        const preference = new Preference(mercadopago);

        //Generamos el Id de la orden
        const newNumberOrder = await generateNumber();

        const result = await preference.create({
            body: {
                items: preferenceItems,
                back_urls: {
                    success: `https://www.bambbistore.com.ar/payment-status`, // redirige al finalizar exitosamente
                    failure: `https://www.bambbistore.com.ar/payment-status`, // redirige si falla
                    pending: `https://www.bambbistore.com.ar/payment-status`, // redirige si queda pendiente (por ejemplo, pago en efectivo)
                    },
                    auto_return: 'approved', // hace que se redirija automáticamente si el pago fue aprobado
                    external_reference: newNumberOrder
                },
            },
        );

        const date = new Date();
        const dateFormated = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        const newOrder = new Order(
            {orderId: newNumberOrder.toString(),
             date: dateFormated, 
             products: order.products, 
             total: 0, 
             toSend: order.toSend });

        await newOrder.save();
        res.status(200).json({ id: result.id, init_point: result.init_point });

    } catch (error) {
        console.error('Error al crear la preferencia de pago:', error);
        res.status(500).json({ error: 'Error al crear la preferencia de pago', details: error.message });
    }
};

// @desc    Modifica el estado del pago en la orden
// @route   POST /api/webhook
// @access  Publico
export const updateMpStatus = async (req, res) => {
    try {
        // const {type: data} = req.body;
        const body = req.body;
        //Nos interesamos solamente en los tipos payments de todo lo que envia Mercado Pago
        if(body.type === 'payment' && body.data?.id) {
            const paymentId = body.data.id;

            //Consultamos el pago en mercadopago con el ID
            const payment = new Payment(mercadopago);
            const paymentInfo = await payment.get({
                        id: paymentId,
                })

            //Estado del pago real que nos da MercadoPago
            const {status, external_reference} = paymentInfo; //approved, pending, rejected

            if(status === 'approved') {
                //buscamos y actualizamos la orden de compra en la base de datos
                const order = await Order.findOneAndUpdate(
                    {orderId: external_reference},
                    {mp_status: status, total: paymentInfo.transaction_details.net_received_amount},
                    {new: true}
                );
                await sendEmail({
                    to: order.toSend.email,
                    affair: `Confirmacion de pago de la orden: ${order.orderId}`,
                    msjHTML: `
                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
                        <h2 style="color: #c21f35;">Hola ${order.toSend.name}, ¡recibimos tu pago!</h2>

                        <p>¡Excelente! Confirmamos el pago por tu compra en <strong>Bambbistore</strong>.</p>

                        <p><strong>Tu pedido #${order.orderId}</strong></p>

                        <p>Ya estamos preparando tu pedido para enviártelo. ¡Te vamos a avisar cuando esté en camino!</p>

                        <h3>Datos de envío:</h3>
                        <p>
                            Dirección: ${order.toSend.address}<br>
                            Provincia/Estado: ${order.toSend.city}<br>
                        </p>

                        <p>Seguí el estado de tu pedido desde este link:</p>
                        <p><a href="https://www.bambbistore.com.ar/track-order" style="color: #c21f35;">www.bambbistore.com.ar/track-order</a></p>

                        <p>Saludos,<br>
                        <strong>Bambbistore</strong></p>
                        </div>
                    `
                })
                console.log(`Orden N° ${external_reference} actualizada a estado: ${status}`);
            }

            if(status === 'cancelled'){
                const order = await Order.findOneAndUpdate(
                    {orderId: external_reference},
                    {mp_status: status},
                    {new: true}
                );
                console.log(`Orden N° ${external_reference} actualizada a estado: ${status}`);
                await restoreStockFromOrder(order.products)
                console.log(order)
            }

            if (status === 'rejected'){
                const order = await Order.findOneAndUpdate(
                    {orderId: external_reference},
                    {mp_status: status},
                    {new: true}
                );
                await restoreStockFromOrder(order.products)
                console.log(`Orden N° ${external_reference} actualizada a estado: ${status}`);  
            }

            //Le decimos a Mercado Pago que todo salio bien
            return res.status(200).json({ success: true});
        }

        //Si no es un pago, lo ignoramos
        res.staus(200).json({received: true});
        
    } catch (error) {
        console.error("Error en Webhook, Metodo: updateMpStatus(): ", error);
        res.status(500).json( {error: "Error Interno del Servidor"})
    }
};


/***SACAR DE AQUI */
const  generateNumber= async ()=> {
    let code;
    let exist = true;

    while (exist) {
        code = generateNumberOrder();
        exist = await Order.exists({ orderId: code }) !== null;
    }

    return code;
    }

const generateNumberOrder = () => {
    const fecha = new Date();
    const year = fecha.getFullYear().toString().slice(-2); // últimos 2 dígitos del año
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // mes con 2 dígitos
    
    const randomNum = Math.floor(1000 + Math.random() * 9000); // número aleatorio 4 dígitos
    
    return `ORD-${year}${month}-${randomNum}`;
}