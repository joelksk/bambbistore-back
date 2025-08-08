import cloudinary from '../config/cloudinary.js'
import fs from "fs-extra";

export const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "products",
        });
        await fs.unlink(filePath); // Eliminamos el archivo temporal
        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error("Error al subir imagen a Cloudinary:", error.message);
        throw new Error('Error al subir imagen a Cloudinary.');
    }
};

// Eliminamos la imagen de cloudinary por el id publico
export const deleteImages = async (images) => {
    try {
       await images.map((image) => cloudinary.uploader.destroy(image.public_id));
       return true
    } catch (error) {
      throw new Error('Error al eliminar imagen de Cloudinary');
    }
  };