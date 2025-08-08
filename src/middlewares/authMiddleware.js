import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) return res.status(401).json({ msg: 'Acceso denegado.'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(400).json({ msg: 'Token inválido' });
    }
}

export default authMiddleware;