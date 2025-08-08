import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'
import { fileURLToPath } from 'url';
import path from 'path'
import history  from 'connect-history-api-fallback'

//configuramos variables de entorno
dotenv.config();

//conectamos a la base de datos
connectDB();

const app = express();

// Obtén la ruta del directorio actual (__dirname en ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares
app.use(cors());
app.use(express.json());

// Middleware para permitir carga de archivos
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/', // Carpeta temporal para archivos
}));

//Rutas
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes);

//Servimos el frontend
app.use(history({
  index: '/index.html',
}));
app.use(express.static(path.join(__dirname, 'public')));
// app.get('/*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// })

//Puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => 
console.log(`Servidor corriendo en http://localhost:${PORT}`)
)