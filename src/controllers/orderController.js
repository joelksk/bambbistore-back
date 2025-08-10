import Order from '../models/Order.js';
// import { sendEmail } from '../middlewares/MaileroMiddleware.js';

const SERVER_ERROR = 'Error Interno del Servidor.'

// @desc    Crear una nueva Orden
// @route   POST /api/orders
// @access  Publica
export const createOrder = async (req, res) => {
  try {
    const {orderId, products, total, toSend} = req.body;

    if (!products || products.length === 0 || !total) {
      return res.status(400).json({ message: 'Productos y monto total son obligatorios.' });
    }
    const date = new Date();
    const dateFormated = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const newOrder = new Order({orderId, date: dateFormated, products, total, toSend });
    await newOrder.save();
    // await sendEmail(toSend, orderId)
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error en el metodo createOrder() ', error);
    res.status(500).json({ msg: SERVER_ERROR})
  }
};

// @desc    Obtener todas las ordenes
// @route   GET /api/orders
// @access  Privado (Solo el Administrador)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error en el metodo getAllOrders() ', error);
    res.status(500).json({ msg: SERVER_ERROR})
  }
};

// @desc    Obtener una Orden por el Id
// @route   GET /api/orders/:id
// @access  Publica
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.find({orderId: req.params.id}).populate('products.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order[0]);
  } catch (error) {
    console.error('Error en el metodo getOrderById() ', error);
    res.status(500).json({ msg: SERVER_ERROR})
  }
};

// @desc    Actualizar el estado de una Orden por el Id
// @route   PUT /api/orders/:id/status
// @access  Privado (Solo el Administrador)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, andreani } = req.body;
    const date = new Date();
    const dateFormated = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status, 
        andreaniCode:{
          code: andreani,
          date: dateFormated
        }
       },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error en el metodo updateOrderStatus() ', error);
    res.status(500).json({ msg: SERVER_ERROR})
  }
};

