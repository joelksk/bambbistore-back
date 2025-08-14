import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    orderId: {type: String, required: true},
    date: {type: Date, required: true},
    products: [{
        _id: false,
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number},
        size: {type: String},
    }],
    total: {type: Number},
    status: {type: String, enum: [
        'recibido',
        'confirmado',
        'en preparacion',
        'enviado',
        'cancelado'
    ], default: 'recibido'},
    toSend: {
        address: {type: String, required: true},
        betweenStreets: {type: String, required: true},
        city: {type: String, required: true},
        dni: {type: String, required: true},
        email: {type: String, required: true},
        heightSt: {type: String, required: true},
        name: {type: String, required: true},
        postCode: {type: String, required: true},
        phone: {type: String, required: true},
        references: {type: String, default: ''}
    },
    mp_status: { type: String, default: 'pendiente'},
    andreaniCode: {
        code: {type: String},
        date: {type: Date}
    }
})

const Order = mongoose.model('Order', orderSchema)

export default Order;