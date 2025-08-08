import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar al administrador por email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ msg: 'Email o contraseña incorrectos' });
        }

        // Comparar contraseñas
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Email o contraseña incorrectos' });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token válido por 1 día
        );

        // Devolver el token
        res.status(200).json({
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });

    } catch (error) {
        console.error('Error en el metodo login():', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
