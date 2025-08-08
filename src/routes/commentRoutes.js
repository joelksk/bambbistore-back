import express from 'express';
import { createComment, getAllComments } from '../controllers/commentController.js';

const router = express.Router();

//POST /api/comments
router.post('/', createComment);
//GET /api/comments
router.get('/', getAllComments);

export default router;
