import Comment from '../models/Comment.js';

const SERVER_ERROR = 'Error Interno del Servidor.'

// @desc    Crear una nueva Comentario
// @route   POST /api/comments
// @access  Publico
export const createComment = async (req, res) => {
  try {
    const { name, content, rating } = req.body;
    if (!name  || !content || !rating) {
      return res.status(400).json({ message: 'Todos los datos son obligatorios.' });
    }
    const newComment = new Comment({ name, content, rating });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error en el metodo createComment() ', error);
    res.status(500).json({ msg: SERVER_ERROR})
  }
};

// @desc    Obtener todos los Comentarios
// @route   POST /api/comments
// @access  Publico
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error en el metodo getAllComments() ', error);
    res.status(500).json({ msg: SERVER_ERROR})
  }
};
