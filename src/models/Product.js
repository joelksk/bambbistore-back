import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: [{
    size: String,
    availables: Number
  }],
  images: [{
    url: { type: String },
    public_id: { type: String }
}],
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  solds: {type: Number}
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
