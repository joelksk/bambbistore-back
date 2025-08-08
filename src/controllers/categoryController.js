import Category from '../models/Category.js'

const SERVER_ERROR = 'Error Interno del Servidor.'

// @desc    Crear una nueva Categoria
// @route   POST /api/categories
// @access  Privado (Solo el Administrador)
export const createCategory = async (req, res) => {
    try {
        const {name} = req.body;
        if (!name) {
          return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
        }
        const newCategory = new Category ({name});
        await newCategory.save()
        res.status(201).json(newCategory)
    } catch (error) {
        console.error('Error en el metodo createCategory() ', error);
        res.status(500).json({ msg: SERVER_ERROR})
    }
}

// @desc    Obtener todas las Categorias
// @route   GET /api/categories
// @access  Publica
export const getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
        console.error('Error en el metodo getAllCategories() ', error);
        res.status(500).json({ msg: SERVER_ERROR})
    }
  };

// @desc    Actualizar una Categoria
// @route   PUT /api/categories/:id
// @access  Privada (Solo el Administrador)
export const updateCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true }
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error en el metodo updateCAtegory() ', error);
        res.status(500).json({ msg: SERVER_ERROR})
    }
  };
  
// @desc    Eliminar una Categoria
// @route   DELETE /api/categories/:id
// @access  Privada (Solo el Administrador)
export const deleteCategory = async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      if (!deletedCategory) return res.status(404).json({ msg: 'Categoria no encontrada.' });
      res.status(200).json({ msg: 'Categoria eliminada.' });
    } catch (error) {
        console.error('Error en el metodo deleteCategory() ', error);
        res.status(500).json({ msg: SERVER_ERROR})
    }
  };