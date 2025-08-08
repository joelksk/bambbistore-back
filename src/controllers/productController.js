 import Product from '../models/Product.js'
 import {uploadImage, deleteImages} from '../services/cloudinaryService.js'

const SERVER_ERROR = 'Error Interno del Servidor.'

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Publico
 export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products)
    } catch (error) {
        console.error('Error en el metodo GetAllProducts()', error)
        res.status(500).json({msg: SERVER_ERROR})
    }
 }

 //@desc Crear un nuevo producto
 //@route POST /api/products
 //@access Privado (Solo el Administrador)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const newStock = JSON.parse(stock)

        const product = new Product({
            name,
            description,
            price,
            category,
            stock: newStock,
            images: []
        });

        if (req.files?.images) {
            const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            // Subir imágenes en paralelo
           
            const uploadPromises = files.map(file => uploadImage(file.tempFilePath));
            const uploadedImages = await Promise.all(uploadPromises);

            // Agregar las imágenes subidas al producto
            uploadedImages.forEach(image => {
                product.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                });
            });
        }

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error en el metodo createProduct(),', error)
        res.status(500).json({ msg: SERVER_ERROR})
    }
}

 //@desc Obtiene un producto por el ID
 //@route POST /api/products/:id
 //@access Publico
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if(!product) return res.status(404).json({msg: 'Producto no econtrado.'})
        res.status(200).json(product)
    } catch (error) {
        console.error('Error en el metodo updateProduct() ', error)
        res.status(500).json({msg: SERVER_ERROR})
    }
}

 //@desc Actualiza el producto
 //@route POST /api/products/:id
 //@access Privado (Solo el Administrador)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category} = req.body;

        let product = await Product.findById({_id: id});
        if(!product) return res.status(404).json({ msg: 'Producto no encontrado' });

        //Actualizamos los campos que correspondan
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = JSON.parse(stock) || product.stock;
        product.category = category || product.category;
        
            // Manejar imágenes nuevas
        if (req.files?.newImages) {
            const files = Array.isArray(req.files.newImages) ? req.files.newImages : [req.files.newImages];
                // Subir imágenes en paralelo
                const uploadPromises = files.map(file => uploadImage(file.tempFilePath));
                const uploadedImages = await Promise.all(uploadPromises);
        
                // Agregar nuevas imágenes al array existente
                uploadedImages.forEach(image => {
                    product.images.push({
                        url: image.secure_url,
                        public_id: image.public_id
                    });
                });
            }

        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true})
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error en el metodo updateProduct() ', error);
        res.status(400).json({ msg: SERVER_ERROR})
    }
}

 //@desc Eliminar un producto
 //@route POST /api/products/:id
 //@access Privado (Solo el Administrador)
export const deleteProduct = async (req, res) => {
    try {
        const {images} = await Product.findById({_id: req.params.id});
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct) return res.status(404).json({msg: 'Producto no encontrado.'});
        await deleteImages(images)
        res.status(200).json({msg: 'Producto eliminado.'})
     } catch (error) {
        console.error('Error en el metodo deleteProdcut() ', error)
        res.status(500).json({ msg: SERVER_ERROR})
     }
}
