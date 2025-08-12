import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js'; // Asegúrate que la ruta sea correcta

dotenv.config();

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error de conexión:', error));

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('', 10); // Puedes cambiar la contraseña

    const admin = new Admin({
      email: '', // Cambia por el correo que quieras
      password: hashedPassword
    });

    await admin.save();
    console.log('Administrador creado correctamente');
    process.exit(); // Finaliza el script
  } catch (error) {
    console.error('Error creando el admin:', error);
    process.exit(1);
  }
};

createAdmin();
